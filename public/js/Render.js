export default class Render {
    constructor() {
        this.initialize();
    }

    initialize() {
        document.getElementById('scene-one').hidden = false;
        document.getElementById('scene-two').hidden = true;
        document.getElementById('scene-three').hidden = true;
    }

    toggleHidden(element) {
        element.hidden = !element.hidden;
    }

    changeScene(sceneNumber) {
        switch (sceneNumber) {
            case 1:
                document.getElementById('scene-one').style.display = 'block';
                document.getElementById('scene-two').style.display = 'none';
                document.getElementById('scene-three').style.display = 'none';
                break;
                
            case 2:
                document.getElementById('scene-one').style.display = 'none';
                document.getElementById('scene-two').style.display = 'block';
                document.getElementById('scene-three').style.display = 'none';
                break;

            case 3:
                document.getElementById('scene-one').style.display = 'none';
                document.getElementById('scene-two').style.display = 'none';
                document.getElementById('scene-three').style.display = 'block';
                break;

            default:
                break;
        }
    }
}