import { API_BASE_URL } from '@/constants'

export async function getHelloWorld() {
    try {
        const response = await fetch(`${API_BASE_URL}/test`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return { message: "Error fetching data" };
    }
}

export async function getTripStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/tripstats`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching trip stats:", error);
        return { message: "Error fetching trip stats" };
    }
}

export async function getWelcomeMessage() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/welcome`, {
            method: 'GET',
            credentials: 'include', // Ensures session cookie is sent
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            const text = await response.text();
            console.warn("Unexpected response from /api/welcome:", text);
            return { message: "Welcome, user" };
        }
    } catch (error) {
        console.error("Error fetching welcome message:", error);
        return { message: "Welcome, user" };
    }
}