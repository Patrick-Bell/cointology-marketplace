import { motion } from 'framer-motion';

function RotateBounce({ children }) {
    // Define animation variants
    const featureVariants = {
        initial: { rotate: 0 }, // Starting position (0 degrees)
        hover: { rotate: 180, transition: { duration: 0.3 } }, // Rotate halfway on hover
        exit: { rotate: 0, transition: { duration: 0.3 } }, // Return to starting position
    };

    return (
        <motion.div 
            variants={featureVariants} 
            initial="initial" // Set initial state
            whileHover="hover" // Trigger hover state
            whileTap="exit" // Optional: You can define what happens on tap (click) if needed
        >
            {children}
        </motion.div>
    );
}

export default RotateBounce;
