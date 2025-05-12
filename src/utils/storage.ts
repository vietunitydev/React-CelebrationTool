import { Project, Lesson } from '@/types';

const PROJECTS_KEY = 'language_projects';

export const getProjects = (): Project[] => {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveProjects = (projects: Project[]): void => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

export const addProject = (name: string): Project => {
    const projects = getProjects();
    const newProject: Project = {
        id: crypto.randomUUID(),
        name,
        lessons: []
    };

    projects.push(newProject);
    saveProjects(projects);
    return newProject;
};

export const updateProject = (project: Project): void => {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === project.id);

    if (index !== -1) {
        projects[index] = project;
        saveProjects(projects);
    }
};

export const deleteProject = (projectId: string): void => {
    const projects = getProjects();
    const filteredProjects = projects.filter(p => p.id !== projectId);
    saveProjects(filteredProjects);
};

export const addLesson = (projectId: string, name: string): Lesson | null => {
    const projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex === -1) return null;

    const newLesson: Lesson = {
        id: crypto.randomUUID(),
        name,
        words: []
    };

    projects[projectIndex].lessons.push(newLesson);
    saveProjects(projects);
    return newLesson;
};

export const updateLesson = (projectId: string, lesson: Lesson): void => {
    const projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex !== -1) {
        const lessonIndex = projects[projectIndex].lessons.findIndex(l => l.id === lesson.id);

        if (lessonIndex !== -1) {
            projects[projectIndex].lessons[lessonIndex] = lesson;
            saveProjects(projects);
        }
    }
};

export const deleteLesson = (projectId: string, lessonId: string): void => {
    const projects = getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);

    if (projectIndex !== -1) {
        projects[projectIndex].lessons = projects[projectIndex].lessons.filter(l => l.id !== lessonId);
        saveProjects(projects);
    }
};