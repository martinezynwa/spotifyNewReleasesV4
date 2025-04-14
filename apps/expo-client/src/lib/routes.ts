export enum Route {
  HOME = "/",
  PROFILE = "/profile",
}

export const pathNameMapper: Record<Route, string> = {
  [Route.HOME]: "Home",
  [Route.PROFILE]: "Profile",
};

export const getPathTitle = (path: string) => {
  return {
    shouldOverrideHeader: false,
    pathName: pathNameMapper[path as Route] || "",
  };
};
