import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Snackbar from 'react-native-snackbar';

import { ASYNC_STORAGE_KEYS } from "@/src/utils/constants";
import { TaskItemType, UserDataStoreType, UserType } from "@/src/utils/types";

export const getRandomId = () => Math.floor(Math.random() * 100).toString()

export const generateHash = (val: string) => {
    let hash = 0, chr = 0;
    if (val.length === 0) {
        return hash.toString();
    }
    for (let i = 0; i < val.length; i++) {
        chr = val.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return Math.abs(hash).toString();
}

const errorHelper = (error: unknown, defaultMessage: string) => {
    let errorMessage = '';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    Snackbar.show({ text: defaultMessage + ' ' + errorMessage });
}

const getInitialData = async (fetchAllUsers = true, fetchLoggedInUser = true) => {
    let usersResponse: UserDataStoreType[] | null = null;
    let loggedInUserResponse: UserType | null = null;
    if (fetchAllUsers) {
        const response = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.USERS);
        if (response) {
            usersResponse = JSON.parse(response)
        }
    }
    if (fetchLoggedInUser) {
        const response = await AsyncStorage.getItem(ASYNC_STORAGE_KEYS.LOGIN);
        if (response) {
            loggedInUserResponse = JSON.parse(response);
        }
    }
    return { usersResponse, loggedInUserResponse };
}

const getTasks = async () => {
    const { usersResponse, loggedInUserResponse } = await getInitialData();
    if (usersResponse && loggedInUserResponse) {
        const foundUser = usersResponse.find(val => val.user.email === loggedInUserResponse.email);
        if (foundUser) {
            return foundUser.tasks
        } else {
            throw new Error(`Couldn't find user! Please try again`);
        }
    } else {
        throw new Error('Failed to get tasks from AsyncStorage');
    }
}

export const setTasks = async (tasks: TaskItemType[]) => {
    const { loggedInUserResponse, usersResponse } = await getInitialData();
    if (usersResponse && loggedInUserResponse) {
        const foundUserIndex = usersResponse.findIndex(val => val.user.email === loggedInUserResponse.email);
        if (foundUserIndex !== -1) {
            usersResponse[foundUserIndex].tasks = tasks;
            await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USERS, JSON.stringify(usersResponse));
            return usersResponse[foundUserIndex].tasks
        } else {
            throw new Error(`Couldn't find logged in user!`)
        }
    } else {
        throw new Error(`Couldn't find user data!`)
    }
}

export const loginUser = async (email: string, password: string) => {
    try {
        email = email.toLowerCase(), password = password.toLowerCase()
        const { usersResponse } = await getInitialData(true, false);
        if (usersResponse) {
            const foundUser = usersResponse.find(val => val.user.email === email && val.user.password === generateHash(password))
            if (foundUser) {
                const user: UserType = { ...foundUser.user }
                await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.LOGIN, JSON.stringify(user))
                return user;
            } else {
                throw new Error('Invalid credentials');
            }
        } else {
            throw new Error('User doesnt exist. Please sign up!')
        }
    } catch (error) {
        errorHelper(error, 'Failed to login user.');
        return null;
    }
};

export const getCurrentUser = async () => {
    try {
        const { loggedInUserResponse } = await getInitialData(false, true);
        return loggedInUserResponse;
    } catch (error) {
        errorHelper(error, `Failed to fetch current user!`);
        return null;
    }

}

export const signupUser = async (email: string, password: string) => {
    try {
        email = email.toLowerCase(), password = password.toLowerCase()
        const user: UserType = { email, password: generateHash(password) };
        await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.LOGIN, JSON.stringify(user));

        const { usersResponse } = await getInitialData(true, false);
        if (usersResponse) {
            if (usersResponse.find(val => val.user.email === email)) {
                throw new Error('User already exists')
            } else {
                usersResponse.push({ user, tasks: [] })
                await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USERS, JSON.stringify(usersResponse));
            }
        } else {
            const usersData: UserDataStoreType[] = [{ user, tasks: [] }];
            await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USERS, JSON.stringify(usersData));
        }
        return user;
    } catch (error) {
        errorHelper(error, 'Failed to register user. Please try again');
        return null;
    }
};

export const isUserLoggedIn = async () => {
    try {
        const { loggedInUserResponse } = await getInitialData(false, true);
        return !!loggedInUserResponse;
    } catch (error) {
        errorHelper(error, 'Something went wrong!');
        return false;
    }
}

export const logout = async () => {
    try {
        await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.LOGIN);
        Snackbar.show({ text: 'Logged out!' })
        return true;
    } catch (error) {
        errorHelper(error, 'Failed to logout user!');
        return false;
    }
};

const scheduleNotification = async (taskItem: TaskItemType) => {
    try {
        if (taskItem.taskTime) {
            const channelId = await notifee.createChannel({
                id: taskItem.id,
                name: `${taskItem.id} Channel`,
                importance: AndroidImportance.HIGH,
                bypassDnd: true,
            });
            const trigger: TimestampTrigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: moment(taskItem.taskTime).toDate().getTime(),
            };
            await notifee.createTriggerNotification({
                title: 'Reminder for due task',
                body: taskItem.taskTitle,
                android: { channelId, pressAction: { id: 'default' } },
            }, trigger);
        }
    } catch (error) {
        console.error('NOTF ERROR', error);
        Snackbar.show({ text: 'There was some problem in scheduling notification' })
        throw error;
    }
}

const cancelScheduledNotification = async (id: string) => {
    await notifee.cancelNotification(id)
}

export const addTask = async (taskItem: TaskItemType) => {
    try {
        const tasks = await getTasks();
        tasks.push(taskItem);
        await setTasks(tasks)
        scheduleNotification(taskItem)
        return true;
    } catch (error) {
        errorHelper(error, 'Failed to store task');
        return false;
    }
};

export const addSampleData = async () => {
    const randomNumber = getRandomId()
    const response = await addTask({
        taskTitle: `Sample title ${randomNumber}`,
        taskContent: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        taskTime: moment().add(1, 'days'),
        createdAt: moment(),
        priorityIs: Math.floor(Math.random() * 3) + 1,
        isUpdated: false,
        isCompleted: false,
        id: randomNumber,
        collaborators: [],
        category: 'General'
    });
    Snackbar.show({ text: response ? 'Added sample task' : 'Failed to add sample task' })
};

export const updateTask = async (task: TaskItemType) => {
    try {
        const tasks = await getTasks();
        const foundIndex = tasks.findIndex(val => val.id === task.id)
        if (foundIndex !== -1) {
            if (tasks[foundIndex].taskTime) {
                cancelScheduledNotification(tasks[foundIndex].id)
            }
            tasks[foundIndex] = task;
            const tasksResponse = await setTasks(tasks)
            scheduleNotification(task)
            return tasksResponse;
        } else {
            throw new Error('Failed to find task')
        }
    } catch (error) {
        errorHelper(error, 'Failed to update task');
        return null;
    }
};

export const deleteTask = async (id: string) => {
    try {
        let tasks = await getTasks();
        tasks = tasks.filter(val => val.id !== id)
        const response = await setTasks(tasks);
        Snackbar.show({ text: 'Deleted task successfully!' })
        return response;
    } catch (error) {
        errorHelper(error, "Failed to delete task.")
        return null;
    }
};

export const updateIsTaskCompleted = async (isCompleted: boolean, taskId: string) => {
    try {
        const tasks = await getTasks();
        const foundIndex = tasks.findIndex(item => item.id === taskId)
        if (foundIndex !== -1) {
            tasks[foundIndex].isCompleted = isCompleted
            return await setTasks(tasks);
        } else {
            throw new Error('Unable to find task from storage!');
        }
    }
    catch (error) {
        errorHelper(error, 'Failed to update task');
        return null;
    }
};

export const deleteUser = async () => {
    try {
        let { usersResponse, loggedInUserResponse } = await getInitialData();
        if (usersResponse && loggedInUserResponse) {
            const foundUserIndex = usersResponse.findIndex(val => val.user.email === loggedInUserResponse.email);
            if (foundUserIndex !== -1) {
                usersResponse = usersResponse.splice(foundUserIndex, 1);
                await AsyncStorage.setItem(ASYNC_STORAGE_KEYS.USERS, JSON.stringify(usersResponse));
                await AsyncStorage.removeItem(ASYNC_STORAGE_KEYS.LOGIN);
            } else {
                throw new Error(`Couldn't find logged in user!`);
            }
        } else {
            throw new Error(`Couldn't find user data!`);
        }
    } catch (error) {
        errorHelper(error, 'Failed to delete user.');
        return false;
    }
};

export const currentUserEmail = async () => {
    try {
        const { loggedInUserResponse } = await getInitialData(false, true);
        return loggedInUserResponse ? loggedInUserResponse.email : null;
    } catch (error) {
        errorHelper(error, `Couldn't find user email!`);
        return null;
    }
};

export const getAllTasks = async () => {
    try {
        return await getTasks();
    } catch (error) {
        errorHelper(error, 'Failed to fetch all tasks.');
        return [];
    }
};

export const shouldNotShowCard = (item: TaskItemType, completedFilter: boolean, priorityFilter: number) => {
    if (completedFilter && !item.isCompleted) {
        return true;
    }
    if (priorityFilter !== -1 && priorityFilter !== item.priorityIs) {
        return true;
    }
    return false;
}