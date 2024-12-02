import { useState, useEffect } from "react";

export const useTypingEffect = (placeholders, typingSpeed = 150, deletingSpeed = 50, delay = 1000) => {
    const [placeholder, setPlaceholder] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleTypingEffect = () => {
            const currentWord = placeholders[currentWordIndex];

            if (!isDeleting && currentCharIndex < currentWord.length) {
                setPlaceholder((prev) => prev + currentWord[currentCharIndex]);
                setCurrentCharIndex((prev) => prev + 1);
            } else if (isDeleting && currentCharIndex > 0) {
                setPlaceholder((prev) => prev.slice(0, -1));
                setCurrentCharIndex((prev) => prev - 1);
            } else if (!isDeleting && currentCharIndex === currentWord.length) {
                setTimeout(() => setIsDeleting(true), delay);
            } else if (isDeleting && currentCharIndex === 0) {
                setIsDeleting(false);
                setCurrentWordIndex((prev) => (prev + 1) % placeholders.length);
            }
        };

        const typingDelay = isDeleting ? deletingSpeed : typingSpeed;
        const timer = setTimeout(handleTypingEffect, typingDelay);

        return () => clearTimeout(timer);
    }, [currentCharIndex, isDeleting, currentWordIndex, placeholders, typingSpeed, deletingSpeed, delay]);

    return placeholder;
};
