// openChat.service.ts

export async function openChat(
    apiUrl: string, 
    token: string, 
    targetId: number,
) {
    try {
        const response = await fetch(`${apiUrl}/chats/open/${targetId}`, {
            method: 'GET', 
            headers: {
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const data = await response.json();
            return data;
        }
    } catch(err) {
        console.error(err);
    }
};