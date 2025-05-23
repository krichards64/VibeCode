// Learning Management System JavaScript

class LearningManagementSystem {
    constructor() {
        this.currentSection = 'dashboard';
        this.progress = {
            reading: 0,
            writing: 0,
            math: 0
        };
        this.completedLessons = new Set();
        this.currentLesson = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        this.init();
        this.loadProgress();
    }

    init() {
        this.setupNavigation();
        this.setupLessonButtons();
        this.setupModal();
        this.setupSubjectCards();
        this.updateProgressDisplay();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.subject;
                this.showSection(section);
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    setupSubjectCards() {
        const subjectCards = document.querySelectorAll('.subject-card');
        subjectCards.forEach(card => {
            card.addEventListener('click', () => {
                const subject = card.dataset.subject;
                this.showSection(subject);
                
                // Update nav
                const navButtons = document.querySelectorAll('.nav-btn');
                navButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.subject === subject) {
                        btn.classList.add('active');
                    }
                });
            });
        });
    }

    setupLessonButtons() {
        const lessonButtons = document.querySelectorAll('.start-lesson-btn');
        lessonButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lessonCard = btn.closest('.lesson-card');
                const lesson = lessonCard.dataset.lesson;
                this.startLesson(lesson);
            });
        });
    }

    setupModal() {
        const modal = document.getElementById('lesson-modal');
        const closeBtn = document.querySelector('.close');
        
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }
    }

    startLesson(lessonType) {
        this.currentLesson = lessonType;
        this.currentQuestionIndex = 0;
        this.score = 0;
        
        const lessonData = this.getLessonData(lessonType);
        this.displayLesson(lessonData);
        this.openModal();
    }

    getLessonData(lessonType) {
        const lessons = {
            'alphabet': {
                title: 'Alphabet Recognition',
                description: 'Learn to identify and pronounce letters',
                questions: [
                    {
                        question: 'Which letter comes after "B"?',
                        options: ['A', 'C', 'D', 'E'],
                        correct: 1
                    },
                    {
                        question: 'What is the first letter of the alphabet?',
                        options: ['B', 'A', 'C', 'Z'],
                        correct: 1
                    },
                    {
                        question: 'Which of these is a vowel?',
                        options: ['B', 'C', 'E', 'F'],
                        correct: 2
                    }
                ]
            },
            'phonics': {
                title: 'Basic Phonics',
                description: 'Connect letters to sounds',
                questions: [
                    {
                        question: 'What sound does the letter "B" make?',
                        options: ['Buh', 'Bee', 'Bay', 'Boo'],
                        correct: 0
                    },
                    {
                        question: 'Which letter makes the "Sss" sound?',
                        options: ['C', 'S', 'Z', 'X'],
                        correct: 1
                    },
                    {
                        question: 'What sound does "CH" make together?',
                        options: ['Kuh', 'Chuh', 'Shuh', 'Thuh'],
                        correct: 1
                    }
                ]
            },
            'sight-words': {
                title: 'Sight Words',
                description: 'Common words recognition',
                questions: [
                    {
                        question: 'Which word means "myself"?',
                        options: ['me', 'I', 'my', 'mine'],
                        correct: 1
                    },
                    {
                        question: 'Complete: "_____ dog is brown"',
                        options: ['The', 'A', 'An', 'This'],
                        correct: 0
                    },
                    {
                        question: 'Which word means the opposite of "go"?',
                        options: ['run', 'walk', 'come', 'move'],
                        correct: 2
                    }
                ]
            },
            'comprehension': {
                title: 'Reading Comprehension',
                description: 'Understand what you read',
                questions: [
                    {
                        question: 'If a story says "The cat sat on the mat", where is the cat?',
                        options: ['On the chair', 'On the mat', 'Under the table', 'In the box'],
                        correct: 1
                    },
                    {
                        question: 'What does "The sun is bright" tell us about the sun?',
                        options: ['It is dark', 'It gives light', 'It is cold', 'It is small'],
                        correct: 1
                    },
                    {
                        question: 'In "The bird flies high", what is the bird doing?',
                        options: ['Swimming', 'Running', 'Flying', 'Walking'],
                        correct: 2
                    }
                ]
            },
            'letter-writing': {
                title: 'Letter Formation',
                description: 'Practice writing letters correctly',
                questions: [
                    {
                        question: 'Which letter is written with one straight line down?',
                        options: ['O', 'I', 'C', 'S'],
                        correct: 1
                    },
                    {
                        question: 'Which letter starts with a circle?',
                        options: ['L', 'T', 'O', 'I'],
                        correct: 2
                    },
                    {
                        question: 'How many lines does the letter "T" have?',
                        options: ['1', '2', '3', '4'],
                        correct: 1
                    }
                ]
            },
            'spelling': {
                title: 'Spelling Practice',
                description: 'Learn to spell common words',
                questions: [
                    {
                        question: 'How do you spell the word for a furry pet that meows?',
                        options: ['cat', 'cot', 'cut', 'bat'],
                        correct: 0
                    },
                    {
                        question: 'Which spelling is correct for the color of grass?',
                        options: ['grean', 'green', 'grene', 'gren'],
                        correct: 1
                    },
                    {
                        question: 'How do you spell the number after two?',
                        options: ['tree', 'three', 'thre', 'thee'],
                        correct: 1
                    }
                ]
            },
            'sentences': {
                title: 'Sentence Building',
                description: 'Create complete sentences',
                questions: [
                    {
                        question: 'Which is a complete sentence?',
                        options: ['The dog', 'Running fast', 'The dog runs fast.', 'Fast dog running'],
                        correct: 2
                    },
                    {
                        question: 'What should come at the end of a sentence?',
                        options: ['Comma', 'Period', 'Question mark', 'Both B and C'],
                        correct: 3
                    },
                    {
                        question: 'Which word should be capitalized?',
                        options: ['dog', 'run', 'the', 'john'],
                        correct: 3
                    }
                ]
            },
            'story-writing': {
                title: 'Story Writing',
                description: 'Write short stories and paragraphs',
                questions: [
                    {
                        question: 'What should every story have?',
                        options: ['Beginning only', 'Middle only', 'End only', 'Beginning, middle, and end'],
                        correct: 3
                    },
                    {
                        question: 'Which makes a story interesting?',
                        options: ['Characters', 'Setting', 'Problem', 'All of the above'],
                        correct: 3
                    },
                    {
                        question: 'How should you start a story?',
                        options: ['The end', 'Once upon a time', 'And then', 'Finally'],
                        correct: 1
                    }
                ]
            },
            'counting': {
                title: 'Counting',
                description: 'Learn numbers 1-100',
                questions: [
                    {
                        question: 'What number comes after 5?',
                        options: ['4', '6', '7', '3'],
                        correct: 1
                    },
                    {
                        question: 'How many fingers do you have on both hands?',
                        options: ['5', '8', '10', '12'],
                        correct: 2
                    },
                    {
                        question: 'What number comes before 10?',
                        options: ['8', '9', '11', '7'],
                        correct: 1
                    }
                ]
            },
            'addition': {
                title: 'Addition',
                description: 'Basic addition problems',
                questions: [
                    {
                        question: 'What is 2 + 3?',
                        options: ['4', '5', '6', '7'],
                        correct: 1
                    },
                    {
                        question: 'What is 1 + 1?',
                        options: ['1', '2', '3', '11'],
                        correct: 1
                    },
                    {
                        question: 'What is 4 + 2?',
                        options: ['5', '6', '7', '8'],
                        correct: 1
                    }
                ]
            },
            'subtraction': {
                title: 'Subtraction',
                description: 'Basic subtraction problems',
                questions: [
                    {
                        question: 'What is 5 - 2?',
                        options: ['2', '3', '4', '7'],
                        correct: 1
                    },
                    {
                        question: 'What is 10 - 5?',
                        options: ['4', '5', '6', '15'],
                        correct: 1
                    },
                    {
                        question: 'What is 8 - 3?',
                        options: ['4', '5', '6', '11'],
                        correct: 1
                    }
                ]
            },
            'shapes': {
                title: 'Shapes & Patterns',
                description: 'Identify basic geometric shapes',
                questions: [
                    {
                        question: 'How many sides does a triangle have?',
                        options: ['2', '3', '4', '5'],
                        correct: 1
                    },
                    {
                        question: 'Which shape is round?',
                        options: ['Square', 'Triangle', 'Circle', 'Rectangle'],
                        correct: 2
                    },
                    {
                        question: 'How many sides does a square have?',
                        options: ['3', '4', '5', '6'],
                        correct: 1
                    }
                ]
            }
        };
        
        return lessons[lessonType] || lessons['counting'];
    }

    displayLesson(lessonData) {
        const lessonContent = document.getElementById('lesson-content');
        const question = lessonData.questions[this.currentQuestionIndex];
        
        lessonContent.innerHTML = `
            <div class="lesson-content">
                <h3>${lessonData.title}</h3>
                <p>${lessonData.description}</p>
                
                <div class="question">
                    <h4>Question ${this.currentQuestionIndex + 1} of ${lessonData.questions.length}</h4>
                    <p>${question.question}</p>
                    
                    <div class="options">
                        ${question.options.map((option, index) => 
                            `<div class="option" data-index="${index}">${option}</div>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="lesson-nav">
                    <button class="lesson-btn" id="prev-btn" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <div class="score-display">Score: ${this.score}/${lessonData.questions.length}</div>
                    <button class="lesson-btn" id="next-btn" disabled>Next</button>
                </div>
            </div>
        `;
        
        this.setupQuestionHandlers(lessonData);
    }

    setupQuestionHandlers(lessonData) {
        const options = document.querySelectorAll('.option');
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selections
                options.forEach(opt => {
                    opt.classList.remove('selected', 'correct', 'incorrect');
                });
                
                // Mark selected option
                option.classList.add('selected');
                
                // Check if correct
                const selectedIndex = parseInt(option.dataset.index);
                const correctIndex = lessonData.questions[this.currentQuestionIndex].correct;
                
                setTimeout(() => {
                    if (selectedIndex === correctIndex) {
                        option.classList.add('correct');
                        this.score++;
                    } else {
                        option.classList.add('incorrect');
                        options[correctIndex].classList.add('correct');
                    }
                    
                    nextBtn.disabled = false;
                    
                    // Update score display
                    document.querySelector('.score-display').textContent = 
                        `Score: ${this.score}/${lessonData.questions.length}`;
                }, 500);
            });
        });
        
        nextBtn.addEventListener('click', () => {
            if (this.currentQuestionIndex < lessonData.questions.length - 1) {
                this.currentQuestionIndex++;
                this.displayLesson(lessonData);
            } else {
                this.completeLesson(lessonData);
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
                this.displayLesson(lessonData);
            }
        });
    }

    completeLesson(lessonData) {
        this.completedLessons.add(this.currentLesson);
        
        // Update progress based on lesson type
        const subject = this.getSubjectFromLesson(this.currentLesson);
        this.updateSubjectProgress(subject);
        
        // Show completion message
        const lessonContent = document.getElementById('lesson-content');
        const percentage = Math.round((this.score / lessonData.questions.length) * 100);
        
        lessonContent.innerHTML = `
            <div class="lesson-content">
                <h3>🎉 Lesson Complete!</h3>
                <p>You finished: ${lessonData.title}</p>
                
                <div class="completion-stats">
                    <div class="stat-circle">
                        <span class="stat-number">${this.score}</span>
                        <span class="stat-label">Correct</span>
                    </div>
                    <div class="stat-circle">
                        <span class="stat-number">${percentage}%</span>
                        <span class="stat-label">Score</span>
                    </div>
                </div>
                
                <div class="completion-message">
                    ${percentage >= 80 ? 
                        '<p class="success">Excellent work! You\'re ready for the next lesson.</p>' :
                        percentage >= 60 ?
                        '<p class="good">Good job! Consider reviewing this lesson again.</p>' :
                        '<p class="needs-work">Keep practicing! Try this lesson again to improve.</p>'
                    }
                </div>
                
                <div class="lesson-nav">
                    <button class="lesson-btn" onclick="lms.closeModal()">Continue Learning</button>
                    <button class="lesson-btn" onclick="lms.retryLesson()">Try Again</button>
                </div>
            </div>
        `;
        
        this.saveProgress();
        this.updateProgressDisplay();
    }

    getSubjectFromLesson(lessonType) {
        const readingLessons = ['alphabet', 'phonics', 'sight-words', 'comprehension'];
        const writingLessons = ['letter-writing', 'spelling', 'sentences', 'story-writing'];
        const mathLessons = ['counting', 'addition', 'subtraction', 'shapes'];
        
        if (readingLessons.includes(lessonType)) return 'reading';
        if (writingLessons.includes(lessonType)) return 'writing';
        if (mathLessons.includes(lessonType)) return 'math';
        return 'reading';
    }

    updateSubjectProgress(subject) {
        const subjectLessons = {
            reading: ['alphabet', 'phonics', 'sight-words', 'comprehension'],
            writing: ['letter-writing', 'spelling', 'sentences', 'story-writing'],
            math: ['counting', 'addition', 'subtraction', 'shapes']
        };
        
        const totalLessons = subjectLessons[subject].length;
        const completedCount = subjectLessons[subject].filter(lesson => 
            this.completedLessons.has(lesson)
        ).length;
        
        this.progress[subject] = Math.round((completedCount / totalLessons) * 100);
    }

    updateProgressDisplay() {
        // Update progress bars
        Object.keys(this.progress).forEach(subject => {
            const progressFills = document.querySelectorAll(`[data-progress="${subject}"]`);
            const progressTexts = document.querySelectorAll(`[data-progress-text="${subject}"]`);
            
            progressFills.forEach(fill => {
                fill.style.width = `${this.progress[subject]}%`;
            });
            
            progressTexts.forEach(text => {
                text.textContent = `${this.progress[subject]}% Complete`;
            });
        });
        
        // Update overall progress
        const totalProgress = Math.round(
            (this.progress.reading + this.progress.writing + this.progress.math) / 3
        );
        
        const overallProgressElement = document.getElementById('overall-progress');
        if (overallProgressElement) {
            overallProgressElement.textContent = `${totalProgress}%`;
        }
        
        // Update lessons completed count
        const lessonsCompletedElement = document.getElementById('lessons-completed');
        if (lessonsCompletedElement) {
            lessonsCompletedElement.textContent = this.completedLessons.size;
        }
        
        // Update progress circle
        const progressCircle = document.querySelector('.large-progress-circle');
        if (progressCircle) {
            const degrees = (totalProgress / 100) * 360;
            progressCircle.style.background = `conic-gradient(#667eea ${degrees}deg, #e0e0e0 ${degrees}deg)`;
        }
    }

    openModal() {
        const modal = document.getElementById('lesson-modal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('lesson-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    retryLesson() {
        if (this.currentLesson) {
            this.startLesson(this.currentLesson);
        }
    }

    saveProgress() {
        const progressData = {
            progress: this.progress,
            completedLessons: Array.from(this.completedLessons),
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem('basiclearn_progress', JSON.stringify(progressData));
    }

    loadProgress() {
        const savedData = localStorage.getItem('basiclearn_progress');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.progress = data.progress || this.progress;
                this.completedLessons = new Set(data.completedLessons || []);
                this.updateProgressDisplay();
            } catch (error) {
                console.log('Error loading progress:', error);
            }
        }
    }
}

// Initialize the Learning Management System when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.lms = new LearningManagementSystem();
});
