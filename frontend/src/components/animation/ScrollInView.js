import { motion } from 'framer-motion'

function ScrollInView({ direction, children }) {

    const featureVariants = {
        hidden: (direction) => ({
            opacity: 0,
            x: direction === 'left' ? -200 : direction === 'right' ? 200 : 0,
            y: direction === 'top' ? -200 : direction === 'bottom' ? 200 : 0,
        }),
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 30,
            }
        }
    };

    return (
        <>
        <motion.div custom={direction} initial='hidden' whileInView='visible' variants={featureVariants}>
        {children}
        </motion.div>
        </>
    )
}

export default ScrollInView