const randomString = (stringLength: number) => {

    let randomStringGenerated = "";

    const baseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < stringLength; i++)
        randomStringGenerated += baseChars.charAt(Math.floor(Math.random() * baseChars.length));

    return randomStringGenerated;

}

export const Utils = {

    randomString

}