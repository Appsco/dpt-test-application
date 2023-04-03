window.addEventListener('DOMContentLoaded', () => {
    [...document.getElementsByClassName('popupframeButton')].forEach((element) => {
        element.addEventListener("click", function (e) {
            let popup = e.currentTarget.parentNode;

            function isOverlay(node) {
                return !!(
                    node &&
                    node.classList &&
                    node.classList.contains("popup-overlay")
                );
            }

            while (popup && !isOverlay(popup)) {
                popup = popup.parentNode;
            }
            if (isOverlay(popup)) {
                popup.style.display = "none";
            }
        });
    });

    let infoPopup = document.getElementById("infoModalPopup");
    [...document.getElementsByClassName('infoModalOpenButton')].forEach((element) => {
        element.addEventListener('click', () => {
            showHideModal(infoPopup);
            insertDescription(element);
        });
    });

    document.getElementById("modalOpenButton")?.addEventListener('click', () => {
        let popup = document.getElementById("modalPopup");
        showHideModal(popup);
    });

    document.querySelectorAll('[data-open-section]').forEach(node => {
        node.addEventListener('click', e => {
            openSection(e, node.getAttribute('data-open-section'));
        })
    })
    function openSection(event, sectionName) {
        var i, sectionContent, sectionLinks;
        sectionContent = document.getElementsByClassName("sectionContent");
        for (i = 0; i < sectionContent.length; i++) {
            sectionContent[i].style.display = "none";
        }
        sectionLinks = document.getElementsByClassName("sectionLinks");
        for (i = 0; i < sectionLinks.length; i++) {
            sectionLinks[i].className = sectionLinks[i].className.replace(
                "indicatoractive",
                "indicatorinactive"
            );
        }
        document.getElementById(sectionName).style.display = "block";
        event.currentTarget.firstChild.nextSibling.classList.add(
            "indicatoractive"
        );
    }

    document.querySelectorAll('[data-copy]').forEach(node => {
        node.addEventListener('click', (e) => {
            let selection = document.querySelector(node.getAttribute("data-copy"))?.value;
            if (!navigator.clipboard) {
                document.querySelector(node.getAttribute("data-copy")).select();
                document.execCommand("copy")
                return;
            }
            navigator.clipboard.writeText(selection);
            e.preventDefault()
        })
    })
});

function showHideModal(popup) {
    if (!popup) return;
    let popupStyle = popup.style;
    if (popupStyle) {
        popupStyle.display = "flex";
        popupStyle.zIndex = 100;
        popupStyle.backgroundColor = "rgba(113, 113, 113, 0.3)";
        popupStyle.alignItems = "center";
        popupStyle.justifyContent = "center";
    }
    popup.setAttribute("closable", "");

    let onClick =
        popup.onClick ||
        function (e) {
            if (e.target === popup && popup.hasAttribute("closable")) {
                popupStyle.display = "none";
            }
        };
    popup.addEventListener("click", onClick);
}

function insertDescription(element){
    let descriptionElement = element.querySelector('[data-description]');
    let description = descriptionElement.innerHTML;

    let container = document.querySelectorAll('.info-modal-content')[0];
    container.innerHTML  = description;
}