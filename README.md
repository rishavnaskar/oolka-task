# Personal Task Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/rishavnaskar/oolka-task)](https://github.com/rishavnaskar/oolka-task/issues)
[![GitHub stars](https://img.shields.io/github/stars/rishavnaskar/oolka-task)](https://github.com/rishavnaskar/oolka-task/stargazers)

Personal Task Manager is a simple yet powerful tool to help you keep track of your tasks, manage your time effectively, and increase your productivity. Whether you are a student, a professional, or just someone who wants to stay organized, this task manager is designed to meet your needs.

[**Android APK**](https://github.com/rishavnaskar/oolka-task/releases/download/v1/app-release.apk)

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Task Management**: Add, edit, and delete tasks with ease.
- **Due Dates**: Set deadlines to ensure tasks are completed on time.
- **Prioritization**: Mark tasks as high, medium, or low priority.
- **Categories**: Organize tasks into categories for better structure.

## Installation

To get started with the Personal Task Manager, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/rishavnaskar/oolka-task.git
    cd oolka-task
    ```

2. **Install Dependencies**:
    ```bash
    npx expo install
    ```

3. **Run the Application**:
    ```bash
    npx expo start
    ```

## Usage

1. **Adding a Task**:
   - Click on the "Add Task" button.
   - Fill in the task details such as title, description, due date, priority, and category.
   - Click "Save" to add the task to your list.

2. **Editing a Task**:
   - Click on the task you want to edit.
   - Update the task details as needed.
   - Click "Save" to apply the changes.

3. **Deleting a Task**:
   - Click on the task you want to delete.
   - Click the "Delete" button and confirm the deletion.

4. **Searching through tasks**
   - Click on the top search icon on the App bar to access the search box
   - Start typing to search

5. **Toggling theme**
   - Go to settings and switch between dark and light themes!
  
## Under the hood

1. (Microfuzz)[https://github.com/Nozbe/microfuzz] for advanced searching techniques
2. (React Native Pell Rich Editor)[https://www.npmjs.com/package/react-native-pell-rich-editor] for providing an advanced text editor
3. This uses React's Context API for maintaining global states
4. (Notifee)[https://notifee.app/] for handling notifications

## Screenshots

*Dashboard: View all your tasks at a glance* <br /> <br />
<img src='https://github.com/user-attachments/assets/8bf513d7-6a9a-485a-bbab-ed349a737efe' width=250 /> 

*Add Task: Quickly add new tasks with detailed information* <br /> <br />
<img src='https://github.com/user-attachments/assets/fa49dbe5-ac82-4aa7-a9ad-0fa4fc81cafd' width=250 /> 

*Edit Task: Easily modify existing tasks* <br /> <br />
<img src='https://github.com/user-attachments/assets/a748974d-54bd-4ebb-ae6e-3116eba15bc5' width=250 />

*Search Tasks: Easily search through your tasks* <br /> <br />
<img src='https://github.com/user-attachments/assets/97bfde0a-69aa-42f7-a9d0-78fb5f162f3b' width=250 />

*Filters and more: Apply filters, sort your tasks and structure them according to categories* <br /> <br />
<img src='https://github.com/user-attachments/assets/18a82628-1af0-4688-9794-c79b187098c6' width=250 />

*Notifications: Get notified about your upcoming tasks* <br /> <br />
<img src='https://github.com/user-attachments/assets/564b57ea-f5e4-472e-b220-82c95856e2c0' width=250 />


[*Find more screenshots here*](screenshots/)

## Testing

Have ran some tests on the app

<img src='https://github.com/user-attachments/assets/43ca72d4-3d5c-4ea4-a0ee-fed6ed13f4c6' width=400 />

## Contributing

We welcome contributions from the community! To contribute to the Personal Task Manager project, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

Please ensure your code follows the project's coding standards and includes relevant tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out:

- **Author**: Rishav Naskar
- **Email**: [rishavnaskar.r@gmail.com](mailto:rishavnaskar.r@gmail.com)
- **GitHub**: [rishavnaskar](https://github.com/rishavnaskar)

Thank you for using Personal Task Manager! We hope it helps you stay organized and productive.
