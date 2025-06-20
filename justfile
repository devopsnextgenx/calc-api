default:
    @just --list --unsorted

echo PROJECT:
    #!/usr/bin/env bash
    projectName="{{PROJECT}}"
    if [ "$projectName" == "lib" ]; then
        echo "Condition if"
    else
        echo "Condition else"
    fi

clean PROJECT:
    #!/usr/bin/env bash
    cd calc-{{PROJECT}}
    rimraf build

cmake PROJECT:
    #!/usr/bin/env bash
    cd calc-{{PROJECT}}
    cmake -S . -B build

build PROJECT:
    #!/usr/bin/env bash
    cd calc-{{PROJECT}}
    projectName="{{PROJECT}}"
    if [ "$projectName" == "node" ]; then
        npm run build
        npm run test
    else
        cmake --build build
        if [ "$projectName" == "lib" ]; then
            cd ..
            just cp
        fi
    fi

clean-build PROJECT:
    #!/usr/bin/env bash
    cd calc-{{PROJECT}}
    cmake -S . -B build
    cmake --build build
    projectName="{{PROJECT}}"
    if [ "$projectName" == "lib" ]; then
        cd ..
        just cp
    fi

cp:
    #!/usr/bin/env bash
    echo ""
    echo ""
    echo "Copy libcalc.lib"
    cp calc-lib/include/calc.h calc-wrapper/include/calc.h
    cp calc-lib/include/calc.h calc-node/include/calc.h
    mkdir -p calc-wrapper/build/bin/Debug
    # for windows dll and for linux so
    if [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
        cp calc-lib/build/libcalc.so calc-node/libs/
        cp calc-lib/build/libcalc.so calc-node/build/
        cp calc-lib/build/libcalc.so calc-wrapper/libs/
        cp calc-lib/build/libcalc.so calc-wrapper/build/bin/Debug/
    else
        cp calc-lib/build/Debug/libcalc.lib calc-node/libs/
        cp calc-lib/build/Debug/libcalc.dll calc-node/build/
        cp calc-lib/build/Debug/libcalc.lib calc-wrapper/libs/
        cp calc-lib/build/Debug/libcalc.dll calc-wrapper/build/bin/Debug/
    fi

build-all:
    #!/usr/bin/env bash
    projects=("lib" "wrapper" "node")
    for project in "${projects[@]}"; do
        echo "--- Building calc-$project"
        # if [ "$project" == "lib" || "$project" == "wrapper" ]; then
        #     just cmake $project
        # fi
        just build $project
        echo "--- Finished calc-$project"
    done
    just test-wrapper

test-node:
    #!/usr/bin/env bash
    cd calc-node
    npm run test

test-wrapper:
    #!/usr/bin/env bash
    cd calc-wrapper
    # if ./build/bin/Debug/calc-wrapper.exe exists, run it
    if [ -f ./build/bin/Debug/calc-wrapper.exe ]; then
        echo "Running calc-wrapperx.exe tests..."
        ./build/bin/Debug/calc-wrapperx.exe add 1 2
        ./build/bin/Debug/calc-wrapperx.exe substract 5 3
        ./build/bin/Debug/calc-wrapperx.exe multiply 4 6
        ./build/bin/Debug/calc-wrapperx.exe divide 8 2
        ./build/bin/Debug/calc-wrapperx.exe square 8

    else
        echo "Running calc-wrapperx executable not found. Please build first."
        ./build/bin/calc-wrapperx add 1 2
        ./build/bin/calc-wrapperx substract 5 3
        ./build/bin/calc-wrapperx multiply 4 6
        ./build/bin/calc-wrapperx divide 8 2
        ./build/bin/calc-wrapperx square 8
    fi
test-java:
    #!/usr/bin/env bash
    cd calc-java
    mvn spring-boot:run