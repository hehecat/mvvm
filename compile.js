class Compile {
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = document.querySelector(el);
        
        if(this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            this.compile(this.$fragment);
            this.$el.appendChild(this.$fragment);
        }
    }

    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        let child;
        while(child = el.firstChild) {
            fragment.appendChild(child);
        }

        return fragment;
    }

    compile(el) {

    }
}