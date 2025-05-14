class WebUITabs extends HTMLElement {
  constructor() {
    super();
    this.removeAttribute("data-nojs");
    this.tabList = this.querySelector("[data-tablist]");
    this.tabs = this.querySelectorAll("[data-tab]");
    this.tabPanels = this.querySelectorAll("[data-tabpanel]");

    if (
      !this.tabList ||
      this.tabPanels.length === 0 ||
      this.tabs.length === 0
    ) {
      return; // did not find elements
    }

    this.tabList.setAttribute("role", "tablist");

    this.setUpTabPanels();

    this.addEventListener("keydown", this);

    this.tabs.forEach((tabTrigger, index) => {
      tabTrigger.setAttribute("role", "tab");

      tabTrigger.addEventListener("click", (e) => {
        this.handleClick(e);
      });

      if (index !== 0) {
        tabTrigger.setAttribute("tabindex", "-1");
      } else {
        tabTrigger.setAttribute("aria-selected", "true");
      }
    });
  }

  setUpTabPanels() {
    this.tabPanels.forEach((tabPanel) => {
      tabPanel.setAttribute("hidden", "");
      tabPanel.setAttribute("tabindex", "0");
      tabPanel.setAttribute("role", "tabpanel");
    });

    this.tabPanels[0].removeAttribute("hidden");
  }

  switchTab(tab) {
    const activePanel = this.querySelector(tab.getAttribute("href"));
    this.tabPanels.forEach((panel) => {
      panel.setAttribute("hidden", true);
    });
    activePanel.removeAttribute("hidden");

    this.tabs.forEach((t) => {
      t.setAttribute("aria-selected", "false");
      t.setAttribute("tabindex", "-1");
    });

    tab.setAttribute("aria-selected", "true");
    tab.setAttribute("tabindex", "0");
    tab.focus();
  }

  moveLeft() {
    const currentTab = document.activeElement;
    if (!currentTab.previousElementSibling) {
      this.switchTab(this.tabs[this.tabs.length - 1]);
      return;
    }
    this.switchTab(currentTab.previousElementSibling);
  }

  moveRight() {
    const currentTab = document.activeElement;
    if (!currentTab.nextElementSibling) {
      this.switchTab(this.tabs[0]);
      return;
    }
    this.switchTab(currentTab.nextElementSibling);
  }

  // event handlers

  handleClick(e) {
    // show clicked tab and update ARIA props/state
    e.preventDefault();
    this.switchTab(e.target);
  }

  // handles key events
  handleEvent(e) {
    switch (e.key) {
      case "ArrowLeft":
        this.moveLeft();
        break;
      case "ArrowRight":
        this.moveRight();
        break;
      case "Home":
        e.preventDefault();
        this.switchTab(this.tabs[0]);
        break;
      case "End":
        e.preventDefault();
        this.switchTab(this.tabs[this.tabs.length - 1]);
        break;
    }
  }
}

customElements.define("webui-tabs", WebUITabs);
