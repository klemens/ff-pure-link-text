"use strict";

const MENU_ID = "pure-link-text@klemens.io"

browser.menus.create({
    id: MENU_ID,
    title: "Copy link text",
    contexts: [
        "link"
    ]
});

// Will update the menu entry title of hide it if title is null
function updateMenu(title) {
    let update = {
        visible: false
    };

    if(title != null) {
        if(title.length > 25) {
            // TODO: Make limit configurable
            title = title.slice(0, 22) + "...";
        }
        
        update = {
            // Escape & by doubling it to avoid access keys being generated.
            // Note that %s sill causes selected content being interpolated,
            // which cannot be prevented currently.
            title: `Copy "${title.replace(/&/g, "&&")}"`,
            visible: true
        };
    }

    browser.menus.update(MENU_ID, update);
    browser.menus.refresh();
}


// Decide if and what to show when the menu entry is displayed
browser.menus.onShown.addListener(info => {
    // linkText defaults to linkUrl if the link contains no text.
    // Hide copy menu entry in this case (the user can just copy
    // the link address).
    if(info.linkText && info.linkText != info.linkUrl) {
        updateMenu(info.linkText);
    } else {
        updateMenu(null);
    }
});

// Make the menu entry visible again when the context menu is closed,
// otherwise onShown will not be called again when visibile is false
browser.menus.onHidden.addListener(() => {
    browser.menus.update(MENU_ID, {
        visible: true
    });
    browser.menus.refresh();
});

// Copy the link text to the clipboard when the menu entry is clicked
browser.menus.onClicked.addListener(info => {
    if(info.menuItemId != MENU_ID || !info.linkText) {
        return;
    }

    navigator.clipboard.writeText(info.linkText);
});
