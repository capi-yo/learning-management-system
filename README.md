# Learning Management System (LMS)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/capi-yo/learning-management-system.git))
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?logo=vercel)]((https://learning-management-system-eight-psi.vercel.app/))

A modern, interactive **Learning Management System** (LMS) built with **React, TypeScript, and Vite**, designed to provide a seamless learning experience with courses, interactive content, and analytics.

## Table of Contents

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Installation](#installation)
* [Usage](#usage)
* [Project Structure](#project-structure)
* [Contributing](#contributing)
* [License](#license)

## Features

* User authentication and role-based access
* Browse and enroll in courses
* Interactive course content with videos, quizzes, and exercises
* Progress tracking and analytics
* Responsive design for desktop and mobile
* Notifications and alerts
* Integration with **Supabase** for backend services


## Technologies Used

* **Frontend:** React 18, TypeScript, Vite
* **UI/UX:** TailwindCSS, Headless UI, Framer Motion, Lucide Icons
* **Routing:** React Router DOM
* **State Management & Notifications:** React Hot Toast, React Context
* **Data & Backend:** Supabase (Authentication, Database)
* **Charts & Analytics:** Recharts

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/capi-yo/learning-management-system.git
cd lms-project2
```

2. **Install dependencies:**

```bash
npm install
```

3. **Setup environment variables:**
   Create a `.env` file and add:

```
VITE_SUPABASE_URL=(https://yozhbbaifultgkumpjrc.supabase.co)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvemhiYmFpZnVsdGdrdW1wanJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NjY0OTIsImV4cCI6MjA3MjM0MjQ5Mn0.eBnvu53MVeCmZf_J39ssP394cEDSsGozvPz687TgFYk
```

4. **Run development server:**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view in the browser.

## Usage

* Navigate through courses
* Enroll and complete lessons
* Track your learning progress on the dashboard
* Admin users can add or update courses


## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Links

* **Live Demo:** [https://your-vercel-app.vercel.app](https://learning-management-system-eight-psi.vercel.app/)
* **GitHub Repository:** [https://github.com/capi-yo/learning-management-system](https://github.com/capi-yo/learning-management-system)
