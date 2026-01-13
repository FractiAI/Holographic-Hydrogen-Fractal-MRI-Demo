import { motion } from 'framer-motion'

interface ProtocolHeaderProps {
  protocolId: string
  protocolName: string
  executionMode?: string
  stage?: number
  totalStages?: number
}

export default function ProtocolHeader({ 
  protocolId, 
  protocolName, 
  executionMode = "Interactive",
  stage,
  totalStages
}: ProtocolHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.1))',
        border: '2px solid rgba(6, 182, 212, 0.4)',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(6, 182, 212, 0.2), inset 0 0 30px rgba(6, 182, 212, 0.05)',
        fontFamily: 'monospace'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Protocol ID */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <motion.div
            animate={{
              boxShadow: [
                '0 0 10px rgba(6, 182, 212, 0.6)',
                '0 0 20px rgba(6, 182, 212, 0.8)',
                '0 0 10px rgba(6, 182, 212, 0.6)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#06B6D4',
              flexShrink: 0
            }}
          />
          <div>
            <div style={{
              fontSize: '0.75rem',
              color: '#8B5CF6',
              fontWeight: 600,
              letterSpacing: '1px',
              marginBottom: '0.25rem'
            }}>
              PROTOCOL IDENTIFIER
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#06B6D4',
              fontWeight: 700,
              textShadow: '0 0 10px rgba(6, 182, 212, 0.5)'
            }}>
              {protocolId}
            </div>
          </div>
        </div>

        {/* Protocol Name */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#8B5CF6',
            fontWeight: 600,
            letterSpacing: '1px',
            marginBottom: '0.25rem'
          }}>
            PROTOCOL NAME
          </div>
          <div style={{
            fontSize: '1rem',
            color: '#E0E7FF',
            fontWeight: 700
          }}>
            {protocolName}
          </div>
        </div>

        {/* Execution Mode */}
        <div>
          <div style={{
            fontSize: '0.75rem',
            color: '#8B5CF6',
            fontWeight: 600,
            letterSpacing: '1px',
            marginBottom: '0.25rem'
          }}>
            EXECUTION MODE
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: '#10B981',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ●
            </motion.span>
            {executionMode}
          </div>
        </div>

        {/* Progress */}
        {stage && totalStages && (
          <div>
            <div style={{
              fontSize: '0.75rem',
              color: '#8B5CF6',
              fontWeight: 600,
              letterSpacing: '1px',
              marginBottom: '0.25rem'
            }}>
              PROGRESS
            </div>
            <div style={{
              fontSize: '0.9rem',
              color: '#F59E0B',
              fontWeight: 700
            }}>
              {stage}/{totalStages}
            </div>
          </div>
        )}
      </div>

      {/* Holographic Seed Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(139, 92, 246, 0.3)',
          fontSize: '0.7rem',
          color: 'rgba(236, 72, 153, 0.8)',
          fontStyle: 'italic',
          textAlign: 'center'
        }}
      >
        ✧ This protocol is a holographic seed. It unpacks at your edge. ✧
      </motion.div>
    </motion.div>
  )
}

