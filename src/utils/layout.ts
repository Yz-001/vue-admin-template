// 路由相关

import type { RouteRecordName, RouteRecordRaw } from "vue-router";

// 去除设置隐藏的路由
export function filterHiddenRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return (routes || []).filter(route => {
    // 如果当前路由没有被标记为 hidden，则继续处理
    if (!route.meta?.hidden) {
      // 如果有子路由，则递归过滤子路由
      if (Array.isArray(route.children)) {
        route.children = filterHiddenRoutes(route.children);
      }
      return true;
    }
    return false;
  });
}
// 获取固定的路由
export function getFixationRoutes(routes: any[], fixedRoutes: any[] = []) {
  routes.forEach(route => {
    // 如果当前路由有 meta.tabFixation 并且它为 true，则添加到固定路由中
    if (route?.meta?.tabFixation) {
      fixedRoutes.push({
        ...route,
        // 移除 children 属性以确保它们都是一级展示
        children: undefined
      });
    }
    // 递归处理子路由
    if (route.children && route.children.length > 0) {
      getFixationRoutes(route.children, fixedRoutes);
    }
  });
  return fixedRoutes;
}

// 查找指定 name 的节点，并返回它的直接父级节点
export function getNodeOrParentChildren(root: { children: any }, targetName: RouteRecordName | null | undefined) {
  if (root.children) {
    for (let child of root.children) {
      // 如果找到了目标节点，并且它是第一级，则返回该节点本身
      if (child.name === targetName) {
        return child;
      }
      // 如果目标节点在更深层次中，递归查找
      if (child.children) {
        let result = getNodeOrParentChildren(child, targetName);
        if (result !== undefined) {
          // 如果找到目标节点并且它不是根节点的直接子节点，则返回其直接父节点
          return child;
        }
      }
    }
  }
  // 如果没有找到目标节点，返回 undefined
  return undefined;
}
