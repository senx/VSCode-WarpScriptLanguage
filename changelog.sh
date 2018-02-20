#!/bin/bash

echo "# CHANGELOG"
NEXT=$(git rev-list --max-parents=0 HEAD)
git tag | head -n 20 | sort -u -r | while read TAG ; do
    echo
    echo "## ${TAG}"
    git log ${NEXT}..${TAG} --format="> +  %s %N (*par [%cN](%ce) à ts%ct [view commit](https://github.com/Giwi/VSCode-WarpScriptLangage/commit/%H)*)"  | while read LOG; do
        BEGIN=$(echo ${LOG} | sed -rn 's/(^.*)\ ts[0-9]{10}\ .*$/\1/p')
        TIMESTAMP=@$(echo ${LOG} | sed -rn 's/^.*\ ts([0-9]{10})\ .*$/\1/p')
        TIME=$(date -d ${TIMESTAMP} +%H:%M)
        END=$(echo ${LOG} | sed -rn 's/^.*\ ts[0-9]{10}\ (.*)$/\1/p')
        echo "$BEGIN $TIME $END"
    done
    NEXT=${TAG}
done