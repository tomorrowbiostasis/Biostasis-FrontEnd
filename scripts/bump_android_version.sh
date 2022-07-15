#!/bin/bash

OLD_VERSIONNAME=$(grep "versionName" android/app/build.gradle | awk '{print $2}' | tr -d '\"')
NEW_VERSIONNAME=$(grep "versionName" android/app/build.gradle | awk '{print $2}' | tr -d '\"' | awk -F '.' '{print $1 "." $2 "." $3+1}')

sed -i 's/'$OLD_VERSIONNAME'/'$NEW_VERSIONNAME'/g;' android/app/build.gradle
