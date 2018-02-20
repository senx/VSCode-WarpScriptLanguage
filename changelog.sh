#!/bin/bash

echo "# CHANGELOG"
NEXT=$(git rev-list --max-parents=0 HEAD)
git tag | head -n 20 | sort -u -r | while read TAG ; do
    echo
    echo "## ${TAG}"
    git log ${NEXT}..${TAG} --format="> +  %s %N (*by [%cN](mailto:%ce) | [view commit](https://github.com/Giwi/VSCode-WarpScriptLangage/commit/%H)*)"  | while read LOG; do
        echo "$LOG"
    done
    NEXT=${TAG}
done