# Tom's Online Coding Application

## Overview

Tom's Online Coding Application is a web-based platform designed to facilitate remote JavaScript education. It allows mentors to monitor and guide students' progress in real-time, creating an interactive and engaging learning environment.

## Features

- **Lobby Page**: A central hub for selecting code blocks
- **Code Block Pages**: Interactive coding environments for each selected block
- **Real-time Collaboration**: Mentors can observe students' code changes in real-time
- **Role-based Access**: Different views and permissions for mentors and students
- **Syntax Highlighting**: Improved code readability
- **User Count**: Display of active students in each code block
- **Automatic Progress Tracking**: Celebration of successful code solutions

## Pages

### 1. Lobby Page

- Displays the title "Choose code block"
- Lists at least 4 clickable code block items
- No authentication required

### 2. Code Block Page

- Shows the selected code block title
- Features a text editor with initial code template
- Indicates user role (student/mentor)
- Real-time code synchronization using WebSockets
- Syntax highlighting for improved readability
- Displays current number of students in the room
- Celebrates correct solutions with a smiley face

## User Roles

### Mentor (Tom)

- First user to access a code block page
- Read-only view of the code
- Can observe students' code changes in real-time

### Students

- Subsequent users accessing a code block page
- Can edit and modify the code
- Changes are visible to the mentor in real-time

## Technical Notes

- When the mentor leaves a code block page, students are redirected to the lobby
- Student progress is reset when redirected to the lobby
- WebSockets are used for real-time code synchronization
- Syntax highlighting is implemented for better code readability

## Getting Started

(Include instructions for setting up and running the application locally)

## Dependencies

(List main dependencies and technologies used in the project)

## Contributing

(Provide guidelines for contributing to the project, if applicable)

## License

(Specify the license under which the project is released)

## Contact

For any inquiries or support, please contact [Your Contact Information].
