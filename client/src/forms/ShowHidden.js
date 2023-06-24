export default function ShowHidden(invitedOrUser = "", locationOrLevel = "", isModal = false) {
    var flag = 1;
    var hiddenElements = document.getElementsByClassName('hidden');
    var inputs = document.getElementsByTagName('input');
    var invitedElement = document.getElementById('Invited');
    var locationElement = document.getElementById('Location');
    var userElement = document.getElementById('User:');
    var labelElement = document.getElementById('New Level:');
    if (!isModal) {
        for (var i = 0; i < inputs.length - 1; i++) {
            if (inputs[i].value.length === 0) {
                hiddenElements[i].style.display = 'block';
                flag = 0;
            }
        }
        if (hiddenElements[i] === invitedElement && invitedOrUser.length === 0) {
            hiddenElements[i].style.display = 'block';
            flag = 0;
        }
        if (hiddenElements[i + 1] === locationElement && locationOrLevel == "") {
            hiddenElements[i + 1].style.display = 'block';
            flag = 0;
        }
    } else {
        for (var i = 0; i < hiddenElements.length + 1; i++) {
            if ((hiddenElements[i] === userElement && invitedOrUser == "") ||
                (hiddenElements[i] === labelElement && locationOrLevel == "" && locationOrLevel != "0")) {
                hiddenElements[i].style.display = 'block';
                hiddenElements[i].style.color = '#5255ee';
                flag = 0;
            }
        }
    }
    return flag;
}
