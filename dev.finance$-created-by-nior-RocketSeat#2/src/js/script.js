/*const open = document.querySelector(".open-modal");
open.addEventListener('click', () => {
            const modalOverlay = document.querySelector(".modal-overlay");
            modalOverlay.classList.add("active");
            console.log(true);
});

const close = document.querySelector(".button-modal");
close.addEventListener('click', () => {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.classList.remove("active");
    console.log(false);
}) */

const modal = {
    modalOverlay: document.querySelector(".modal-overlay"),
    open() {
            modal.modalOverlay.classList.add("active");
    },

    close() {
        modal.modalOverlay.classList.remove("active");
    }
};
