
export const environment = {
  production: false,
  backendHost : (process.env["BACKEND_HOSTNAME"] != undefined && process.env["BACKEND_PORT"] != undefined)? process.env["BACKEND_HOSTNAME"]+ process.env["BACKEND_PORT"]:"http://localhost:8082"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
