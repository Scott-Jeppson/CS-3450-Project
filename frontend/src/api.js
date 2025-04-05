const API_URL = "http://localhost:8080";

// this fucntion fetches a test message "Hello, World!" to test the connection between the frontend and the backend
export async function getHelloWorld() {
    try {
        const response = await fetch(`${API_URL}/test`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return { message: "Error fetching data" };
    }
}

// getting sumo statistics
export async function getTripStats() {
    try {
        const response = await fetch(`${API_URL}/tripstats`, { method: 'GET' });
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching trip stats:", error);
        return { message: "Error fetching trip stats" };
    }
}
