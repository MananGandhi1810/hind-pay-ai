const validateEmail = (email) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(email).toLowerCase(),
    );
};

const validatePassword = (password) => {
    return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(
        String(password),
    );
};

const validateVpa = (vpa) => {
    return /^[a-zA-Z0-9.-]{2, 256}@[a-zA-Z][a-zA-Z]{2, 64}$/;
};

const validatePhoneNumber = (phoneNumber) => {
    return /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(String(phoneNumber));
};

export { validateEmail, validatePassword, validateVpa, validatePhoneNumber };
