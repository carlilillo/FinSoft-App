export const loadSettingsPage = () =>
    import("./SettingsPage").then((module) => module.SettingsPage);
