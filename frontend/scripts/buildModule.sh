#!/bin/bash

WORKDIR=$(cd $(dirname $0); cd ..; pwd)

# `meta.url` と `?.` を同時に babel に通す方法がないため、? を削除して無理やり通す
find $WORKDIR -type f -name buildModuleUrl.js -exec sed -i "s/import.meta?.url/import.meta.url/g" {} \;

# @cesium/engine/Source/Core/Check.d.ts をビルドしようとして警告が出るため削除する
find . -type f -wholename **/Source/Core/Check.d.ts -exec rm -f {} \;
find . -type f -wholename **/Source/Core/defined.d.ts -exec rm -f {} \;
