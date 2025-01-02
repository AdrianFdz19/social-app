export function getNotificationText(type: string) {
    switch (type) {
        case 'post_reaction':
            return 'has reacted to your post';
        case 'comment':
            return 'has commented on your post';
        case 'follow':
            return 'has started to follow you';
        default:
            return 'has performed an action';
    }
}