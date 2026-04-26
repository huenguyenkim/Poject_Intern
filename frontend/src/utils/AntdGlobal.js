/**
 * AntdGlobal.js: Central store for Ant Design static instances.
 * Prevents circular dependencies by providing a non-component storage for 
 * message, notification, and modal APIs.
 */

export let message = null;
export let notification = null;
export let modal = null;

/**
 * Initializes the static instances from the Ant Design App context.
 * Should be called in useLayoutEffect within the App content.
 */
export const setAntdInstances = (instances) => {
  message = instances.message;
  notification = instances.notification;
  modal = instances.modal;
};
