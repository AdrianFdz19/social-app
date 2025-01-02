// follow.tsx

export default async function follow(
    apiUrl: string,
    token: string,
    userId: number
) {
  try {
    const response = await fetch(`${apiUrl}/users/follow`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}`
        }, 
        body: JSON.stringify({
            userId
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
    } else {
        console.error('Server internal error.');
    }
  } catch(err) {
    console.error(err);
  }
}