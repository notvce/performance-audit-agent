#!/bin/bash

# Performance Audit Agent - GitHub Setup Script
# This script helps you push the project to GitHub

set -e

REPO_NAME="performance-audit-agent"
DESCRIPTION="Universal performance audit agent with enterprise-grade analysis, compatible with MCP for Claude, OpenCode, Gemini, and other AI platforms"

echo "🚀 Performance Audit Agent - GitHub Setup"
echo "=========================================="

# Check if gh CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI (gh) found"

    # Check if user is logged in
    if gh auth status &> /dev/null; then
        echo "✅ GitHub authenticated"

        # Create repo if it doesn't exist
        if ! gh repo view "$REPO_NAME" &> /dev/null; then
            echo "📦 Creating repository: $REPO_NAME"
            gh repo create "$REPO_NAME" --public --description="$DESCRIPTION" --source=. --push
        else
            echo "📦 Repository already exists, adding remote..."
            git remote add origin "https://github.com/$(gh api user --jq '.login')/$REPO_NAME.git" 2>/dev/null || true
            echo "⬆️  Pushing to GitHub..."
            git push -u origin main
        fi
        echo "✅ Done! Repository: https://github.com/$(gh api user --jq '.login')/$REPO_NAME"
    else
        echo "❌ Not authenticated with GitHub. Run: gh auth login"
    fi
else
    echo "❌ GitHub CLI (gh) not installed"
    echo ""
    echo "📋 Manual Steps:"
    echo "1. Go to https://github.com/new"
    echo "   - Repository name: $REPO_NAME"
    echo "   - Description: $DESCRIPTION"
    echo "   - Public/Private: Public"
    echo "   - Don't initialize with README"
    echo ""
    echo "2. Run these commands:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/$REPO_NAME.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
    echo "3. Install GitHub CLI for easier setup:"
    echo "   brew install gh"
fi
