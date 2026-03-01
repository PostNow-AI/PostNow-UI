#!/bin/bash
# Release Script for PostNow UI
# Usage: ./scripts/release.sh [patch|minor|major]
#
# This script uses npm version to:
# 1. Update package.json version
# 2. Create a git commit
# 3. Create a git tag
# 4. Optionally push to remote

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

# Read current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${YELLOW}Current version: v${CURRENT_VERSION}${NC}"

# Determine release type
RELEASE_TYPE="${1:-patch}"

case $RELEASE_TYPE in
    patch|minor|major)
        ;;
    *)
        echo -e "${RED}Invalid release type: $RELEASE_TYPE${NC}"
        echo "Usage: $0 [patch|minor|major]"
        exit 1
        ;;
esac

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo -e "${YELLOW}Warning: Not on main branch (current: $CURRENT_BRANCH)${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

# Check for uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}Error: Uncommitted changes detected. Please commit or stash first.${NC}"
    exit 1
fi

# Use npm version to update version, create commit and tag
npm version "$RELEASE_TYPE" -m "chore(release): :bookmark: v%s"

NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}New version: v${NEW_VERSION}${NC}"

# Ask to push
read -p "Push to remote? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin "$CURRENT_BRANCH"
    git push origin "v${NEW_VERSION}"
    echo -e "${GREEN}Pushed to remote${NC}"
fi

echo -e "${GREEN}Release v${NEW_VERSION} complete!${NC}"
