# MediaPreviewTools

# 富媒体阅览工具组件

This project is React based, it's familiar to Vue3 version, uses the same plugins and libraries, only the framework is different

该项目为React版本，大体使用方式和Vue3版本一致，使用的库和插件等也相同，仅有框架不同

Other explanation to see at Vue3 version Readme: https://github.com/KrazyPhish/MediaPreviewTools_Vue3/blob/main/README.md

其他说明详见Vue3版本的Readme：https://github.com/KrazyPhish/MediaPreviewTools_Vue3/blob/main/README.md

#Other matters need attention:

#其他注意事项

This project based in React, while using the Region of Plugins in Audio module, it cause the situation of re-rendering and adding more regions

该项目由React框架搭建，在使用时音频模块（Audio）的区域插件（Plugins：Region）时会出现重复多次渲染添加区域的情况

It's normal, and to see this in React docs of its Dev render: https://react.dev/reference/react/useEffect#my-effect-runs-twice-when-the-component-mounts

这是正常的，详见React开发阶段的渲染机制：https://react.dev/reference/react/useEffect#my-effect-runs-twice-when-the-component-mounts