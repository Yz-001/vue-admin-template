import type { CustomTinyConfig } from "@/components/BaseTinyEditor/index.vue";
export default function useExpression() {
  const customTinyConfig: CustomTinyConfig = {
    inline: true,
    placeholder: "编辑表达式",
    menubar: false,
    toolbar: false,
    plugins: "",
    resize: false,
    statusbar: false,
    quickbars_insert_toolbar: false,
    quickbars_selection_toolbar: false,
    link_context_toolbar: false,
    forced_root_block_attrs: {
      id: "expfd-root"
    }
  };

  const getCustomHTMLblok = (blokType: BlokType, data: BlokData) => {
    switch (blokType) {
      case "expfd-edit":
        return `<span class="expfd-edit" data-source="${data.source}" data-code="${data.code}">${data.name}</span>`;
      case "expfd-readonly":
        return `<span class="expfd-readonly" data-code="${data.code}" data-source="${data.source}" ${data.otherData || ""} contenteditable="false"><strong class="expfd-readonly__symbol">${data.symbolLeft || "["}</strong>${data.name}<strong class="expfd-readonly__symbol">${data.symbolLeft || "]"}</strong></span>`;
    }
  };
  return {
    customTinyConfig,
    getCustomHTMLblok
  };
}

type BlokType = "expfd-edit" | "expfd-readonly";
export interface BlokData {
  code: string;
  name: string;
  source?: string;
  symbolLeft?: string;
  symbolRight?: string;
  otherData?: string;
}
