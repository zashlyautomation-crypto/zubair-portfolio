import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import '@/styles/hero.css'
import { CONNECT_BUTTON_SIZE } from '@/constants/index'

/**
 * ConnectButton — fixed circular button, persists across all pages.
 * Hidden on mobile via CSS. Mounted at App root level.
 * On click, triggers React Router navigation to /contact.
 */
const ConnectButton = () => {
  const navigate = useNavigate()

  return (
    <motion.button
      className="connect-button"
      onClick={() => navigate('/contact')}
    >
      <span className="connect-label">CONNECT</span>
    </motion.button>
  )
}

export default ConnectButton