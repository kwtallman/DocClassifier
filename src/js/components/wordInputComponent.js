class WordInputComponent extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    get secretText() {
        return this.getAttribute('secretText');
    }

    set secretText(val) {
        this.setAttribute('secretText', val);
    }

    get secretWords() {
        return this.getAttribute('secretWords');
    }

    set secretWords(val) {
        this.setAttribute('secretWords', val);
    }

    get secretDoc() {
        return this.getAttribute('secretDoc');
    }

    set secretDoc(val) {
        this.setAttribute('secretDoc', val);
    }

    get ignoreCase() {
        return this.getAttribute('ignoreCase');
    }

    set ignoreCase(val) {
        this.setAttribute('ignoreCase', val);
    }

    //observed attributes of the component
    static get observedAttributes() {
        return ['secretText', 'secretWords', 'secretDoc', 'ignoreCase'];
    }

    //re add event listeners to each input to kick off an update of their value
    attributeChangedCallback() {
        this.render();
        let secretText = this.shadow.querySelector('#secretText');
        secretText.addEventListener('change', this.changeSecretText.bind(this));  

        let secretWords = this.shadow.querySelector('#secretWords');
        secretWords.addEventListener('change', this.changeSecretText.bind(this));  

        let secretDoc = this.shadow.querySelector('#secretDoc');
        secretDoc.addEventListener('change', this.changeSecretText.bind(this));  

        let ignoreCase = this.shadow.querySelector('#ignoreCase');
        ignoreCase.addEventListener('change', this.changeignoreCase.bind(this)); 
    }

    //updates the value of the secret text input box
    changeSecretText(e) {
        this.setAttribute('secretText', e.target.value);
    }

    //updates the value of the secret words file input
    changeSecretWords(e) {
        this.setAttribute('secretWords', e.target.value);
    }

    //updates the value of the secret text doc file input
    changeSecretDoc(e) {
        this.setAttribute('secretDoc', e.target.value);
    }

    //updates the value of the ignore case check box
    changeignoreCase(e) {
        this.setAttribute('ignoreCase', e.target.checked);
    }

    //add event listeners to each input to kick off an update of their value
    connectedCallback() {
        this.render();
        let secretText = this.shadow.querySelector('#secretText');
        secretText.addEventListener('change', this.changeSecretText.bind(this)); 

        let secretWords = this.shadow.querySelector('#secretWords');
        secretWords.addEventListener('change', this.changeSecretWords.bind(this));  

        let secretDoc = this.shadow.querySelector('#secretDoc');
        secretDoc.addEventListener('change', this.changeSecretDoc.bind(this));  

        let ignoreCase = this.shadow.querySelector('#ignoreCase');
        ignoreCase.addEventListener('change', this.changeignoreCase.bind(this));  
    }

    //create component html and css
    render() {
        this.shadow.innerHTML = `
            <link rel="stylesheet" href="/css/wordInputComponent.css">
            <div>
                <form action="/classify" enctype="multipart/form-data" method="POST" class="submitForm">
                    <label>Secret Text</label>
                    <input value="${this.secretText}" id="secretText" name="secretText" type="text" placeholder="Secret Text"/>
                    <br><br>
                    <label for="secretWords">Secret Words</label>
                    <input value="${this.secretWords}" type="file" id="secretWords" name="secretWords" accept=".txt"/>
                    <br><br>
                    <label for="secretDoc">Secret Document</label>
                    <input value="${this.secretDoc}" type="file" id="secretDoc" name="secretDoc" accept=".txt"/>
                    <br><br>
                    <input type="checkbox" id="ignoreCase" name="ignoreCase" value="${this.ignoreCase}" checked="true"/>
                    <label for="ignoreCase" class="ignoreCheckbox">Ignore Casing</label>
                    <br><br>
                    <input id="classify" name="classify" type="submit" value="Classify"/>
                </form>
            </div> 
        `;
    }
}
customElements.define('word-input-component', WordInputComponent);