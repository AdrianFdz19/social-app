// useFollow.tsx

export default async function useFollow(
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
        console.log('Follow en progreso...');
    } else {
        console.error('Server internal error.');
    }
  } catch(err) {
    console.error(err);
  }
}
