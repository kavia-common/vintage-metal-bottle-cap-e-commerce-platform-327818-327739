#!/bin/bash
cd /home/kavia/workspace/code-generation/vintage-metal-bottle-cap-e-commerce-platform-327818-327739/frontend_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

