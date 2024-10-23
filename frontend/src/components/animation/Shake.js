import { motion } from 'framer-motion'; // Import Framer Motion


function Shake({ children, hasError}) {


    return (

        <motion.div
        animate={hasError ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }} // Shake animation
        transition={{ duration: 0.5 }} // Duration of the shake
        >
            {children}
        </motion.div>
    )
}

export default Shake