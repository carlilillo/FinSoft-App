export const loadLandingPage = () =>
    import("./LandingPage").then((module) => module.LandingPage);
