/**
 * This will return a function which won't be executed for as long as it keeps getting invoked.
 * The passed in `func` will be called once the `wait` in milliseconds has completed.
 * */

export const debounce = (func, wait) => {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
