#!/bin/bash

OLD_VERSIONCODE=$(sed  's/^.*versionCode \(.*[0-9]\)$/\1/p;d' android/app/build.gradle)
NEW_VERSIONCODE=$(echo $OLD_VERSIONCODE | awk '{print $1+1}')

sed -i 's/\(^.*versionCode \)\(.*[0-9]\)$/\1'$NEW_VERSIONCODE'/g;' android/app/build.gradle
