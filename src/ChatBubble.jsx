function ChatBubble({ message, sender }) {
  const isUser = sender === 'user'

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '16px',
      padding: '0 4px'
    }}>
      <div style={{
        maxWidth: '75%',
        padding: '14px 20px',
        borderRadius: isUser
          ? '24px 24px 6px 24px'
          : '24px 24px 24px 6px',
        background: isUser
          ? 'linear-gradient(135deg, rgba(57,105,231,0.75), rgba(125,42,231,0.75))'
          : 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        border: isUser
          ? '1px solid rgba(125,42,231,0.40)'
          : '1px solid rgba(255,255,255,0.20)',
        color: 'white',
        fontSize: '15px',
        fontWeight: '300',
        lineHeight: '1.75',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        letterSpacing: '0.025em',
        boxShadow: isUser
          ? '0 4px 24px rgba(57,105,231,0.25)'
          : '0 4px 24px rgba(0,0,0,0.10)'
      }}>
        {message}
      </div>
    </div>
  )
}

export default ChatBubble