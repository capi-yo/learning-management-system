// Mock data for the LMS application
export interface MockUser {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'admin';
  created_at: string;
}

export interface MockCourse {
  id: string;
  title: string;
  description: string;
  created_at: string;
  lessons: MockLesson[];
  is_enrolled?: boolean;
  progress?: number;
  total_lessons?: number;
  completed_lessons?: number;
}

export interface MockLesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  content_type: 'text' | 'video';
  order_index: number;
  completed?: boolean;
}

export interface MockEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string;
}

export interface MockProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

// Mock users
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    email: 'student@example.com',
    full_name: 'John Doe',
    role: 'student',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'user-2',
    email: 'admin@example.com',
    full_name: 'Jane Smith',
    role: 'admin',
    created_at: '2024-01-01T10:00:00Z',
  },
];

// Mock lessons
export const mockLessons: MockLesson[] = [
  // React Fundamentals lessons
  {
    id: 'lesson-1',
    course_id: 'course-1',
    title: 'Introduction to React',
    content: 'React is a JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Meta and the open-source community.\n\nKey concepts:\n• Components - Reusable pieces of UI\n• JSX - JavaScript syntax extension\n• Props - Data passed to components\n• State - Component data that can change\n\nReact makes it easy to create interactive UIs by breaking them down into small, manageable pieces called components.',
    content_type: 'text',
    order_index: 0,
  },
  {
    id: 'lesson-2',
    course_id: 'course-1',
    title: 'Setting Up Your Development Environment',
    content: 'Before we start building React applications, we need to set up our development environment.\n\nWhat you\'ll need:\n• Node.js (version 14 or higher)\n• A code editor (VS Code recommended)\n• Git for version control\n• Chrome DevTools React extension\n\nWe\'ll use Create React App to bootstrap our first project:\nnpx create-react-app my-app\ncd my-app\nnpm start',
    content_type: 'text',
    order_index: 1,
  },
  {
    id: 'lesson-3',
    course_id: 'course-1',
    title: 'Your First Component',
    content: 'Components are the building blocks of React applications. Let\'s create your first component!\n\nFunction Component Example:\n```jsx\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n```\n\nClass Component Example:\n```jsx\nclass Welcome extends React.Component {\n  render() {\n    return <h1>Hello, {this.props.name}!</h1>;\n  }\n}\n```\n\nFunction components are simpler and more commonly used in modern React development.',
    content_type: 'text',
    order_index: 2,
  },
  {
    id: 'lesson-4',
    course_id: 'course-1',
    title: 'Understanding JSX',
    content: 'This is a video lesson about JSX syntax and how it works in React applications.',
    content_type: 'video',
    order_index: 3,
  },
  {
    id: 'lesson-5',
    course_id: 'course-1',
    title: 'Props and State',
    content: 'Props and state are fundamental concepts in React that help you manage data flow in your applications.\n\nProps (Properties):\n• Data passed from parent to child components\n• Read-only (immutable)\n• Used to customize component behavior\n\nState:\n• Internal component data that can change\n• Triggers re-renders when updated\n• Managed with useState hook in function components\n\nExample:\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n```',
    content_type: 'text',
    order_index: 4,
  },

  // JavaScript Essentials lessons
  {
    id: 'lesson-6',
    course_id: 'course-2',
    title: 'Variables and Data Types',
    content: 'JavaScript has several ways to declare variables and different data types to work with.\n\nVariable Declarations:\n• var - function-scoped (avoid in modern JS)\n• let - block-scoped, can be reassigned\n• const - block-scoped, cannot be reassigned\n\nPrimitive Data Types:\n• Number: 42, 3.14\n• String: "Hello World"\n• Boolean: true, false\n• Undefined: undefined\n• Null: null\n• Symbol: Symbol("id")\n• BigInt: 123n\n\nBest Practice: Use const by default, let when you need to reassign.',
    content_type: 'text',
    order_index: 0,
  },
  {
    id: 'lesson-7',
    course_id: 'course-2',
    title: 'Functions and Arrow Functions',
    content: 'Functions are reusable blocks of code that perform specific tasks.\n\nFunction Declaration:\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```\n\nFunction Expression:\n```javascript\nconst greet = function(name) {\n  return `Hello, ${name}!`;\n};\n```\n\nArrow Function:\n```javascript\nconst greet = (name) => {\n  return `Hello, ${name}!`;\n};\n\n// Shorter syntax for single expressions\nconst greet = name => `Hello, ${name}!`;\n```\n\nArrow functions have a more concise syntax and different `this` binding behavior.',
    content_type: 'text',
    order_index: 1,
  },
  {
    id: 'lesson-8',
    course_id: 'course-2',
    title: 'Arrays and Objects',
    content: 'Arrays and objects are essential data structures in JavaScript.\n\nArrays:\n```javascript\nconst fruits = ["apple", "banana", "orange"];\nfruits.push("grape"); // Add to end\nfruits[0]; // Access by index\nfruits.length; // Get length\n```\n\nObjects:\n```javascript\nconst person = {\n  name: "John",\n  age: 30,\n  city: "New York"\n};\n\nperson.name; // Dot notation\nperson["age"]; // Bracket notation\nperson.email = "john@example.com"; // Add property\n```\n\nBoth are reference types and can be modified after creation.',
    content_type: 'text',
    order_index: 2,
  },

  // Python Basics lessons
  {
    id: 'lesson-9',
    course_id: 'course-3',
    title: 'Python Syntax and Variables',
    content: 'Python is known for its clean, readable syntax. Let\'s start with the basics.\n\nVariables in Python:\n```python\n# No need to declare variable types\nname = "Alice"\nage = 25\nheight = 5.6\nis_student = True\n```\n\nPython Data Types:\n• int: 42\n• float: 3.14\n• str: "Hello"\n• bool: True/False\n• list: [1, 2, 3]\n• dict: {"key": "value"}\n• tuple: (1, 2, 3)\n• set: {1, 2, 3}\n\nPython uses indentation to define code blocks instead of curly braces.',
    content_type: 'text',
    order_index: 0,
  },
  {
    id: 'lesson-10',
    course_id: 'course-3',
    title: 'Control Flow and Loops',
    content: 'Control flow statements help you make decisions and repeat actions in your code.\n\nIf Statements:\n```python\nage = 18\nif age >= 18:\n    print("You are an adult")\nelif age >= 13:\n    print("You are a teenager")\nelse:\n    print("You are a child")\n```\n\nLoops:\n```python\n# For loop\nfor i in range(5):\n    print(i)\n\n# While loop\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n\n# Loop through a list\nfruits = ["apple", "banana", "orange"]\nfor fruit in fruits:\n    print(fruit)\n```',
    content_type: 'text',
    order_index: 1,
  },
  {
    id: 'lesson-11',
    course_id: 'course-3',
    title: 'Functions and Modules',
    content: 'Functions help you organize and reuse code. Modules let you split code across files.\n\nDefining Functions:\n```python\ndef greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\n# Call the function\nmessage = greet("Alice")\nprint(message)  # Hello, Alice!\n\nmessage = greet("Bob", "Hi")\nprint(message)  # Hi, Bob!\n```\n\nImporting Modules:\n```python\n# Import entire module\nimport math\nprint(math.pi)\n\n# Import specific functions\nfrom math import sqrt, pow\nprint(sqrt(16))  # 4.0\n\n# Import with alias\nimport datetime as dt\ntoday = dt.date.today()\n```',
    content_type: 'text',
    order_index: 2,
  },

  // Web Design Fundamentals lessons
  {
    id: 'lesson-12',
    course_id: 'course-4',
    title: 'HTML Structure and Semantics',
    content: 'HTML provides the structure and meaning to web content through semantic elements.\n\nBasic HTML Structure:\n```html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>My Website</title>\n</head>\n<body>\n    <header>\n        <h1>Welcome to My Site</h1>\n        <nav>\n            <ul>\n                <li><a href="#home">Home</a></li>\n                <li><a href="#about">About</a></li>\n            </ul>\n        </nav>\n    </header>\n    <main>\n        <section>\n            <h2>Main Content</h2>\n            <p>This is the main content area.</p>\n        </section>\n    </main>\n    <footer>\n        <p>&copy; 2024 My Website</p>\n    </footer>\n</body>\n</html>\n```\n\nSemantic elements like header, nav, main, section, and footer help screen readers and search engines understand your content.',
    content_type: 'text',
    order_index: 0,
  },
  {
    id: 'lesson-13',
    course_id: 'course-4',
    title: 'CSS Styling and Layout',
    content: 'CSS controls the visual presentation of your HTML content.\n\nBasic CSS Syntax:\n```css\n/* Selector { property: value; } */\nh1 {\n    color: #333;\n    font-size: 2rem;\n    margin-bottom: 1rem;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 0 1rem;\n}\n\n#header {\n    background-color: #f8f9fa;\n    border-bottom: 1px solid #dee2e6;\n}\n```\n\nLayout Methods:\n• Flexbox - for one-dimensional layouts\n• CSS Grid - for two-dimensional layouts\n• Float - legacy method (avoid for layout)\n• Position - for precise element placement\n\nModern CSS focuses on Flexbox and Grid for responsive layouts.',
    content_type: 'text',
    order_index: 1,
  },
  {
    id: 'lesson-14',
    course_id: 'course-4',
    title: 'Responsive Design Principles',
    content: 'Responsive design ensures your website works well on all device sizes.\n\nKey Principles:\n1. Mobile-first approach\n2. Flexible grid systems\n3. Flexible images and media\n4. CSS media queries\n\nMedia Queries:\n```css\n/* Mobile styles (default) */\n.container {\n    padding: 1rem;\n}\n\n/* Tablet styles */\n@media (min-width: 768px) {\n    .container {\n        padding: 2rem;\n    }\n}\n\n/* Desktop styles */\n@media (min-width: 1024px) {\n    .container {\n        max-width: 1200px;\n        margin: 0 auto;\n    }\n}\n```\n\nViewport Meta Tag:\n```html\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n```\n\nThis ensures proper scaling on mobile devices.',
    content_type: 'text',
    order_index: 2,
  },
];

// Mock courses
export const mockCourses: MockCourse[] = [
  {
    id: 'course-1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React including components, props, state, and hooks. Perfect for beginners who want to start building modern web applications.',
    created_at: '2024-01-10T10:00:00Z',
    lessons: mockLessons.filter(lesson => lesson.course_id === 'course-1'),
  },
  {
    id: 'course-2',
    title: 'JavaScript Essentials',
    description: 'Master the core concepts of JavaScript including variables, functions, objects, and modern ES6+ features. Essential foundation for web development.',
    created_at: '2024-01-05T10:00:00Z',
    lessons: mockLessons.filter(lesson => lesson.course_id === 'course-2'),
  },
  {
    id: 'course-3',
    title: 'Python for Beginners',
    description: 'Start your programming journey with Python. Learn syntax, data structures, functions, and object-oriented programming concepts.',
    created_at: '2024-01-15T10:00:00Z',
    lessons: mockLessons.filter(lesson => lesson.course_id === 'course-3'),
  },
  {
    id: 'course-4',
    title: 'Web Design Fundamentals',
    description: 'Learn HTML, CSS, and responsive design principles to create beautiful and functional websites that work on all devices.',
    created_at: '2024-01-20T10:00:00Z',
    lessons: mockLessons.filter(lesson => lesson.course_id === 'course-4'),
  },
];

// Mock enrollments
export const mockEnrollments: MockEnrollment[] = [
  {
    id: 'enrollment-1',
    user_id: 'user-1',
    course_id: 'course-1',
    enrolled_at: '2024-01-16T10:00:00Z',
  },
  {
    id: 'enrollment-2',
    user_id: 'user-1',
    course_id: 'course-2',
    enrolled_at: '2024-01-18T10:00:00Z',
    completed_at: '2024-01-25T15:30:00Z',
  },
];

// Mock progress
export const mockProgress: MockProgress[] = [
  // React course progress
  {
    id: 'progress-1',
    user_id: 'user-1',
    lesson_id: 'lesson-1',
    completed_at: '2024-01-16T11:00:00Z',
  },
  {
    id: 'progress-2',
    user_id: 'user-1',
    lesson_id: 'lesson-2',
    completed_at: '2024-01-16T12:00:00Z',
  },
  {
    id: 'progress-3',
    user_id: 'user-1',
    lesson_id: 'lesson-3',
    completed_at: '2024-01-17T10:00:00Z',
  },
  // JavaScript course progress (completed)
  {
    id: 'progress-4',
    user_id: 'user-1',
    lesson_id: 'lesson-6',
    completed_at: '2024-01-18T10:00:00Z',
  },
  {
    id: 'progress-5',
    user_id: 'user-1',
    lesson_id: 'lesson-7',
    completed_at: '2024-01-19T10:00:00Z',
  },
  {
    id: 'progress-6',
    user_id: 'user-1',
    lesson_id: 'lesson-8',
    completed_at: '2024-01-20T10:00:00Z',
  },
];

// Current user state
export let currentUser: MockUser | null = null;
export let isAuthenticated = false;

export const setCurrentUser = (user: MockUser | null) => {
  currentUser = user;
  isAuthenticated = !!user;
};

// Helper functions
export const getUserEnrollments = (userId: string) => {
  return mockEnrollments.filter(enrollment => enrollment.user_id === userId);
};

export const getUserProgress = (userId: string) => {
  return mockProgress.filter(progress => progress.user_id === userId);
};

export const getCourseProgress = (userId: string, courseId: string) => {
  const course = mockCourses.find(c => c.id === courseId);
  if (!course) return { completed: 0, total: 0, percentage: 0 };
  
  const userProgress = getUserProgress(userId);
  const courseLessonIds = course.lessons.map(lesson => lesson.id);
  const completedLessons = userProgress.filter(progress => 
    courseLessonIds.includes(progress.lesson_id)
  );
  
  return {
    completed: completedLessons.length,
    total: course.lessons.length,
    percentage: course.lessons.length > 0 ? Math.round((completedLessons.length / course.lessons.length) * 100) : 0
  };
};

export const isLessonCompleted = (userId: string, lessonId: string) => {
  return mockProgress.some(progress => 
    progress.user_id === userId && progress.lesson_id === lessonId
  );
};

export const getCompletedCourses = (userId: string) => {
  const enrollments = getUserEnrollments(userId);
  return enrollments
    .filter(enrollment => enrollment.completed_at)
    .map(enrollment => {
      const course = mockCourses.find(c => c.id === enrollment.course_id);
      return course ? {
        ...course,
        completed_at: enrollment.completed_at!,
        total_lessons: course.lessons.length
      } : null;
    })
    .filter(Boolean);
};