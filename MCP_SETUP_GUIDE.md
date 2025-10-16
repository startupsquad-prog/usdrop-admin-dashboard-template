# MCP Server Setup Guide

This guide will help you complete the setup for the Resend and Trigger.dev MCP servers that have been added to your `.cursor/mcp.json` configuration.

## 🚀 MCP Servers Installed

### 1. **shadcn/ui MCP Server** ✅ (Already configured)
- **Purpose**: Access to shadcn/ui component library
- **Status**: Ready to use
- **Usage**: Ask AI to add shadcn components to your project

### 2. **Resend MCP Server** ⚠️ (Needs setup)
- **Purpose**: Send emails programmatically
- **Features**: 
  - Send plain text and HTML emails
  - Schedule emails for future delivery
  - Add CC and BCC recipients
  - Configure reply-to addresses

### 3. **Trigger.dev MCP Server** ⚠️ (Needs setup)
- **Purpose**: Interact with Trigger.dev projects
- **Features**:
  - Search Trigger.dev documentation
  - Initialize new Trigger.dev projects
  - List and manage projects
  - Get task information and trigger runs
  - Deploy projects to different environments

## 📧 Resend MCP Server Setup

### Step 1: Clone the Resend MCP Project
```bash
# Clone the Resend MCP server project
git clone https://github.com/resend/mcp-send-email.git
cd mcp-send-email

# Install dependencies
npm install

# Build the project
npm run build
```

### Step 2: Get Your Resend API Key
1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Create a new API key
3. Copy the API key to your clipboard

### Step 3: Update MCP Configuration
Replace the placeholder values in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "resend": {
      "command": "node",
      "args": [
        "C:/path/to/your/mcp-send-email/build/index.js"
      ],
      "env": {
        "RESEND_API_KEY": "re_your_actual_api_key_here"
      }
    }
  }
}
```

**Important**: 
- Replace `C:/path/to/your/mcp-send-email/build/index.js` with the actual absolute path to your cloned project
- Replace `re_your_actual_api_key_here` with your actual Resend API key

### Step 4: Verify Domain (Optional)
To send emails to addresses other than your own:
1. Go to [Resend Domains](https://resend.com/domains)
2. Add and verify your domain
3. Update the sender email in the MCP configuration

## ⚡ Trigger.dev MCP Server Setup

### Step 1: Install Trigger.dev CLI
```bash
# Install Trigger.dev CLI globally
npm install -g trigger.dev@latest
```

### Step 2: Authenticate
```bash
# Login to Trigger.dev
npx trigger.dev@latest login
```

### Step 3: Test the MCP Server
The Trigger.dev MCP server should work automatically once you're authenticated. You can test it by asking the AI:
- "Search the trigger docs for examples"
- "Initialize trigger.dev in my project"
- "List my Trigger.dev projects"

## 🔧 Configuration Options

### Resend MCP Server Options
You can add these optional environment variables:

```json
{
  "mcpServers": {
    "resend": {
      "command": "node",
      "args": [
        "C:/path/to/your/mcp-send-email/build/index.js"
      ],
      "env": {
        "RESEND_API_KEY": "re_your_actual_api_key_here",
        "SENDER_EMAIL_ADDRESS": "noreply@yourdomain.com",
        "REPLY_TO_EMAIL_ADDRESS": "support@yourdomain.com"
      }
    }
  }
}
```

### Trigger.dev MCP Server Options
You can add these optional arguments:

```json
{
  "mcpServers": {
    "trigger": {
      "command": "npx",
      "args": [
        "trigger.dev@latest",
        "mcp",
        "--dev-only"
      ]
    }
  }
}
```

Available options:
- `--dev-only`: Restrict to development environment only
- `--project-ref <ref>`: Scope to a specific project
- `--log-file <path>`: Log to a specific file
- `--api-url <url>`: Use a custom Trigger.dev API URL

## 🧪 Testing Your Setup

### Test Resend MCP Server
1. Restart Cursor
2. Ask the AI: "Send me a test email using Resend"
3. The AI should be able to send emails on your behalf

### Test Trigger.dev MCP Server
1. Restart Cursor
2. Ask the AI: "Search the trigger docs for a ffmpeg example"
3. The AI should be able to search Trigger.dev documentation

## 🎯 Use Cases for Your Admin Dashboard

### Resend Integration
- **User Registration Emails**: Send welcome emails when new users are created
- **Password Reset**: Send password reset links
- **Admin Notifications**: Notify admins of important events
- **User Activity Reports**: Send periodic reports to users

### Trigger.dev Integration
- **Background Jobs**: Set up scheduled tasks for user management
- **Data Processing**: Process large datasets in the background
- **Email Automation**: Trigger email sequences based on user actions
- **Analytics**: Generate and send analytics reports

## 🔒 Security Notes

1. **API Keys**: Never commit API keys to version control
2. **Environment Variables**: Use environment variables for sensitive data
3. **Domain Verification**: Verify your domain with Resend for better deliverability
4. **Rate Limits**: Be aware of API rate limits for both services

## 📚 Documentation Links

- [Resend MCP Server Docs](https://resend.com/docs/knowledge-base/mcp-server)
- [Trigger.dev MCP Introduction](https://trigger.dev/docs/mcp-introduction)
- [Resend API Documentation](https://resend.com/docs)
- [Trigger.dev Documentation](https://trigger.dev/docs)

## 🆘 Troubleshooting

### Resend Issues
- **Authentication Error**: Check your API key is correct
- **Domain Not Verified**: Verify your domain in Resend dashboard
- **Path Not Found**: Ensure the absolute path to the build script is correct

### Trigger.dev Issues
- **Not Authenticated**: Run `npx trigger.dev@latest login`
- **Project Not Found**: Ensure you have access to the project
- **Permission Denied**: Check your Trigger.dev account permissions

---

**Next Steps**: Complete the setup for both MCP servers and restart Cursor to start using them in your admin dashboard project!
