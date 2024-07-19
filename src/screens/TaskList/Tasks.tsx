import notifee, { AuthorizationStatus } from '@notifee/react-native';
import createFuzzySearch from '@nozbe/microfuzz';
import { debounce } from 'lodash';
import moment from "moment";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
    RefreshControl,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { FAB, Portal, Provider, Snackbar as RNPaperSnackBar } from "react-native-paper";
import Snackbar from "react-native-snackbar";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SlidingUpPanel from "rn-sliding-up-panel";

import FullCard from "@/src/components/FullCard";
import AppBar from "@/src/components/Header";
import TaskCard from "@/src/components/TaskCard";
import TasksListBottomSheet from "@/src/components/TasksListBottomSheet";
import { TasksContext } from "@/src/navigation/TaskProvider";
import { ThemeContext } from "@/src/navigation/ThemeProvider";
import { SCREENS } from "@/src/utils/constants";
import { deleteTask, getAllTasks, shouldNotShowCard } from "@/src/utils/helper";
import { NavigationType, SearchBarProps, SectionListDataType, SortingType, SortModeType, TaskItemType, TaskListDisplayType, ThemeColorPaletteType } from "@/src/utils/types";

const TasksList = ({ navigation }: { navigation: NavigationType }) => {
    const [refreshing, setRefreshing] = useState(true);
    const [sorting, setSorting] = useState<SortingType>({
        sortMode: "taskTime", sortOrder: "descending"
    });
    const [completedFilter, setCompletedFilter] = useState(false);
    const [priorityFilter, setPriorityFilter] = useState(-1);
    const [displayMode, setDisplayMode] = useState<TaskListDisplayType>("compact");
    const [isSnackbarvisible, setIsSnackbarVisible] = useState(false);
    const [deleteTaskId, setDeleteTaskId] = useState('');
    const [searchBarProps, setSearchBarProps] = useState<SearchBarProps>({ isVisible: false, searchText: '' });
    const [debouncedSearchText, setDebouncedSearchText] = useState('')
    const [sectionListData, setSectionListData] = useState<SectionListDataType<TaskItemType>>([]);

    const slidingUpPanelRef = useRef<SlidingUpPanel>(null);

    const { theme } = useContext(ThemeContext);
    const { tasks, setTasks } = useContext(TasksContext)
    const styles = useStyles(theme)

    const debouncedSearch = useCallback(debounce((query: string) => {
        setDebouncedSearchText(query)
    }, 400), []);

    const sortComparator = (a: TaskItemType, b: TaskItemType, { sortMode, sortOrder }: SortingType) => {
        switch (sortMode) {
            case 'createdAt':
                const dateAForCreatedAt = moment(a.createdAt)
                const dateBForCreatedAt = moment(b.createdAt)
                return sortOrder === 'ascending' ? dateBForCreatedAt - dateAForCreatedAt : dateAForCreatedAt - dateBForCreatedAt
            case 'taskTime':
                const dateAForTaskTime = moment(a.taskTime)
                const dateBForTaskTime = moment(b.taskTime)
                return sortOrder === 'ascending' ? dateBForTaskTime - dateAForTaskTime : dateAForTaskTime - dateBForTaskTime
            case 'priorityIs':
                return sortOrder === 'ascending' ? a.priorityIs - b.priorityIs : b.priorityIs - a.priorityIs
            default:
                return 0
        }
    }

    const getTasks = async () => {
        let list = await getAllTasks();
        list = list.sort((a, b) => sortComparator(a, b, sorting))
        setTasks(list);
    };

    const onRefresh = async () => {
        onChangeSearchText('');
        setRefreshing(true);
        Snackbar.show({ text: "Fetching latest tasks" })
        setSorting({ sortMode: "createdAt", sortOrder: "descending" })
        await getTasks();
        setRefreshing(false);
    };

    const handleSorting = (sortMode: SortModeType) => {
        if (tasks) {
            const newSorting: SortingType = {
                sortMode,
                sortOrder: sorting.sortOrder === "ascending" ? "descending" : "ascending",
            }
            setTasks(tasks.sort((a, b) => sortComparator(a, b, newSorting)).slice())
            setSorting(newSorting);
        }
    };

    const handleCompletedFilter = () => {
        setCompletedFilter(!completedFilter);
    };

    const handlePriorityFilter = (priority: number) => {
        if (priorityFilter === priority) {
            setPriorityFilter(-1)
        } else {
            setPriorityFilter(priority);
        }
    };

    const onToggleSnackBar = () => setIsSnackbarVisible(true);

    const onDismissSnackBar = () => {
        setIsSnackbarVisible(false);
        setDeleteTaskId("");
    };

    const handleSetTaskId = (taskId: string) => setDeleteTaskId(taskId);

    const handleDeleteTask = async () => {
        if (deleteTaskId !== "") {
            setRefreshing(true);
            const tasksResponse = await deleteTask(deleteTaskId);
            if (tasksResponse) {
                navigation.navigate(SCREENS.YOUR_TASKS);
                setDeleteTaskId("");
                setTasks(tasksResponse.sort((a, b) => sortComparator(a, b, sorting)))
            }
            setRefreshing(false);
        }
    };

    const handleDisplayMode = (value: TaskListDisplayType) => setDisplayMode(value);

    const handleSearchIconPress = () => {
        setSearchBarProps({ ...searchBarProps, isVisible: !searchBarProps.isVisible })
    }

    const handleFilterIconPress = () => {
        slidingUpPanelRef.current?.show({ toValue: 210, velocity: 0.8 })
    }

    const getInitalData = async () => {
        setRefreshing(true);
        await getTasks();
        setRefreshing(false);
    }

    const onChangeSearchText = (val: string) => {
        setSearchBarProps({ ...searchBarProps, searchText: val })
        debouncedSearch(val)
    }

    const renderTaskCard = ({ item }: { item: TaskItemType }) => (
        <TaskCard
            navigation={navigation}
            taskItem={item}
            onToggleSnackBar={onToggleSnackBar}
            handleSetTaskId={handleSetTaskId}
            onDismissSnackBar={onDismissSnackBar} />
    );

    const renderFullCard = ({ item }: { item: TaskItemType }) => (
        <FullCard
            navigation={navigation}
            taskItem={item}
            onToggleSnackBar={onToggleSnackBar}
            handleSetTaskId={handleSetTaskId}
            onDismissSnackBar={onDismissSnackBar} />
    );

    const updateTasksInMap = (
        val: TaskItemType,
        sectionListMap: Map<string, TaskItemType[]>,
        completedFilter: boolean,
        priorityFilter: number
    ) => {
        if (shouldNotShowCard(val, completedFilter, priorityFilter)) {
            return;
        }
        const key = val.category.toLowerCase()
        const foundTasks = sectionListMap.get(key)
        if (foundTasks) {
            foundTasks.push(val)
            sectionListMap.set(key, foundTasks)
        } else {
            sectionListMap.set(key, [val])
        }
    }

    const getNotificationPermissions = async () => {
        const settings = await notifee.requestPermission();
        if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
            Snackbar.show({
                duration: Snackbar.LENGTH_LONG,
                text: 'Please grant notifications permission to show upcoming task notifications',
                action: {
                    text: 'Notification Settings',
                    onPress: async () => {
                        await notifee.openNotificationSettings()
                    }
                }
            })
        }
    }

    const updateDataInSectionList = () => {
        if (tasks && tasks?.length > 0) {
            const sectionListMap = new Map<string, TaskItemType[]>()

            if (debouncedSearchText.length == 0 || !searchBarProps.isVisible) {
                tasks.forEach((val) => updateTasksInMap(val, sectionListMap, completedFilter, priorityFilter))
            } else {
                createFuzzySearch(tasks, {
                    getText: (item: TaskItemType) => [
                        item.taskTitle,
                        item.taskContent ?? '',
                        moment(item.taskTime).format('YYYY-MM-DD HH:mm:ss'),
                        moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
                    ]
                })(debouncedSearchText)
                    .forEach(({ item }) => updateTasksInMap(item, sectionListMap, completedFilter, priorityFilter))
            }
            const finalList: SectionListDataType<TaskItemType> = [];
            for (const [key, value] of sectionListMap.entries()) {
                finalList.push({ title: key, data: value })
            }
            setSectionListData(finalList)
        }
    }

    useEffect(() => {
        getNotificationPermissions()
    }, [])

    useEffect(() => {
        navigation.addListener('focus', getInitalData)
        return () => {
            navigation.removeListener('focus', getInitalData)
        }
    }, [navigation])

    useEffect(() => {
        updateDataInSectionList()
    }, [debouncedSearchText, searchBarProps.isVisible, tasks, completedFilter, priorityFilter])

    return (
        <Provider>
            <AppBar
                navigation={navigation}
                handleSearch={handleSearchIconPress}
                handleSlider={handleFilterIconPress}
            />
            <View style={styles.flatListContainer}>
                <SectionList
                    removeClippedSubviews={true}
                    sections={sectionListData}
                    keyExtractor={(item) => item.id}
                    renderSectionHeader={({ section: { title, data } }) => data.length > 0 ?
                        <View style={styles.sectionListHeaderContainer}>
                            <Icon name='label-outline' size={24} color={theme?.subTextColor} />
                            <Text style={styles.sectionListHeaderText}>{title}</Text>
                        </View>
                        : null
                    }
                    renderItem={displayMode === "fullcard"
                        ? renderFullCard
                        : renderTaskCard
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["white"]}
                            progressBackgroundColor={theme?.colorAccentSecondary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, color: theme?.subTextColor }}>No tasks found!</Text>
                        </View>
                    }
                    ListHeaderComponent={searchBarProps.isVisible ? <View style={styles.searchBarContainer}>
                        <Icon name='magnify' size={20} color={theme?.iconColor} />
                        <TextInput
                            style={styles.searchBar}
                            placeholder='Start typing...'
                            value={searchBarProps.searchText}
                            onChangeText={onChangeSearchText}
                            placeholderTextColor={theme?.headerColor}
                        />
                        <Icon name='close-circle-outline' size={20} color={theme?.iconColor} onPress={() => onChangeSearchText('')} />
                    </View> : null}
                    contentContainerStyle={{ flexGrow: 1 }}
                />
            </View>
            <FAB
                style={styles.fab}
                icon="plus"
                color={theme?.iconColor}
                onPress={() => navigation.navigate(SCREENS.ADD_TASK)}
            />
            <Portal>
                <TasksListBottomSheet
                    sorting={sorting}
                    completedFilter={completedFilter}
                    prioFilter={priorityFilter}
                    handleRef={slidingUpPanelRef}
                    displayMode={displayMode}
                    handleSorting={handleSorting}
                    handleCompletedFilter={handleCompletedFilter}
                    handlePriorityFilter={handlePriorityFilter}
                    handleDisplayMode={handleDisplayMode}
                />
                <RNPaperSnackBar
                    visible={isSnackbarvisible}
                    onDismiss={onDismissSnackBar}
                    duration={3000}
                    action={{
                        label: "Delete Task",
                        onPress: handleDeleteTask,
                        textColor: theme?.chipColor
                    }}
                    style={{ backgroundColor: theme?.colorAccentPrimary }}
                    theme={{ colors: { accent: "white" } }}
                >
                    Task Completed
                </RNPaperSnackBar>
            </Portal>
        </Provider>
    );
};

export default TasksList;

const useStyles = (theme: ThemeColorPaletteType | null) => StyleSheet.create({
    flatListContainer: {
        flex: 1,
        paddingVertical: 5,
        backgroundColor: theme?.backgroundColor
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: theme?.colorAccentSecondary
    },
    searchBarContainer: {
        paddingHorizontal: 16,
        margin: 10,
        borderRadius: 15,
        elevation: 2,
        backgroundColor: theme?.colorAccentPrimary,
        alignItems: 'center',
        flexDirection: 'row',
    },
    searchBar: {
        flex: 1,
        marginHorizontal: 8,
        paddingVertical: 12,
        color: theme?.headerColor,
    },
    sectionListHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
        paddingHorizontal: 16,
    },
    sectionListHeaderText: {
        textTransform: 'capitalize',
        fontSize: 18,
        color: theme?.subTextColor,
        paddingHorizontal: 8,
    }
});
