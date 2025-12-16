#!/bin/bash
# Repository Organization Check Script
# Validates that the repository follows the project structure rules

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

echo "=== Repository Organization Check ==="
echo ""

# Check 1: No planning docs in root
echo "Checking root directory..."
for file in COMPETITOR_ANALYSIS.md IMPLEMENTATION_PLAN.md MASTER_PLAN.md PRODUCT_VISION.md; do
    if [ -f "$file" ]; then
        echo -e "${RED}ERROR: $file should be in docs/planning/, not root${NC}"
        ((ERRORS++))
    fi
done

# Check 2: Required root files exist
for file in README.md CLAUDE.md LICENSE.md; do
    if [ ! -f "$file" ]; then
        echo -e "${YELLOW}WARNING: Missing $file in root${NC}"
        ((WARNINGS++))
    fi
done

# Check 3: No build logs in root or cv-builder
for log in build_log.txt build_log_*.txt; do
    if [ -f "$log" ]; then
        echo -e "${RED}ERROR: Build log $log should not be committed${NC}"
        ((ERRORS++))
    fi
    if [ -f "cv-builder/$log" ]; then
        echo -e "${RED}ERROR: Build log cv-builder/$log should not be committed${NC}"
        ((ERRORS++))
    fi
done

# Check 4: No .env files (security)
if [ -f ".env" ] || [ -f ".env.local" ]; then
    echo -e "${RED}ERROR: .env files should never be committed${NC}"
    ((ERRORS++))
fi

# Check 5: cv-builder structure
if [ -d "cv-builder" ]; then
    echo "Checking cv-builder structure..."

    # Check for proper component organization
    if [ -d "cv-builder/components" ]; then
        for dir in ai common cv ui; do
            if [ ! -d "cv-builder/components/$dir" ]; then
                echo -e "${YELLOW}WARNING: cv-builder/components/$dir directory missing${NC}"
                ((WARNINGS++))
            fi
        done
    fi
fi

# Check 6: Scripts directory structure
echo "Checking scripts structure..."
if [ ! -d "scripts/development" ]; then
    echo -e "${YELLOW}WARNING: scripts/development directory missing${NC}"
    ((WARNINGS++))
fi

if [ ! -d "scripts/validation" ]; then
    echo -e "${YELLOW}WARNING: scripts/validation directory missing${NC}"
    ((WARNINGS++))
fi

# Check 7: Docs directory structure
echo "Checking docs structure..."
if [ ! -d "docs/planning" ]; then
    echo -e "${YELLOW}WARNING: docs/planning directory missing${NC}"
    ((WARNINGS++))
fi

if [ ! -d "docs/guides" ]; then
    echo -e "${YELLOW}WARNING: docs/guides directory missing${NC}"
    ((WARNINGS++))
fi

# Summary
echo ""
echo "=== Summary ==="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}All checks passed!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}$WARNINGS warning(s) found${NC}"
    exit 0
else
    echo -e "${RED}$ERRORS error(s), $WARNINGS warning(s) found${NC}"
    exit 1
fi
