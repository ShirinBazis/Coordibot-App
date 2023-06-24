export function GetError({inputName}) {
    switch (inputName) {
        case 'Username':
            return 'Please enter a Username'
        case 'Password':
            return 'Please enter a Password'
        case 'Nickname':
            return 'Please enter a Nickname'
        case 'Password Verification':
            return 'Please enter a Password Verification'
        case 'Meeting Title':
            return 'Please enter a Meeting Title'
        case 'Description':
            return 'Please enter a Description'
        case 'Invited':
            return 'Please choose Invited'
        case 'Location':
            return 'Please choose Location'
        case 'User:':
            return 'Please choose user'
        case 'New Level:':
            return 'Please choose new level'
        default:
            return 'Missing content'
    }
}