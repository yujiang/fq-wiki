// .vitepress/markdown-containers.ts
import markdownItContainer from "markdown-it-container";

export function setupContainers(md: any) {
    setupJianghu(md);
    setupPoem(md);
    setupPerson(md);
}

export function setupJianghu(md: any) {
  md.use(markdownItContainer, "jianghu", {
    render(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        // 获取 info 片段，例如 "jianghu jh-red 命运注"
        const raw = token.info.trim().slice("jianghu".length).trim();
        let extraClass = "";
        let title = "";

        if (raw) {
          const parts = raw.split(/\s+/);
          // 第一个是可选 class（以 jh- 开头）
          if (parts[0]?.startsWith("jh-")) {
            extraClass = parts.shift()!;
          }
          // 剩余的是标题文本
          title = parts.join(" ");
        }

        const titleHtml = title ? `<p class="jh-title">${title}</p>` : "";
        return `<div class="custom-block jianghu ${extraClass}">${titleHtml}\n`;
      } else {
        return `</div>\n`;
      }
    },
  });
}

export function setupPoem(md: any) {
  md.use(markdownItContainer, "poem", {
    render(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        // e.g. "poem pm-gold 江湖行"
        const raw = token.info.trim().slice("poem".length).trim();
        let extraClass = "";
        let title = "";

        if (raw) {
          const parts = raw.split(/\s+/);
          // 第一个词若以 pm- 开头，作为样式类
          if (parts[0]?.startsWith("pm-")) {
            extraClass = parts.shift()!;
          }
          title = parts.join(" ");
        }

        const titleHtml = title
          ? `<p class="pm-title">${md.utils.escapeHtml(title)}</p>`
          : "";
        return `<div class="custom-block poem ${extraClass}">${titleHtml}\n`;
      } else {
        return `</div>\n`;
      }
    },
  });
}

export function setupPerson(md: any) {
  md.use(markdownItContainer, "person", {
    render(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        // info 形如： "person ps-ink 独孤怜"
        const raw = token.info.trim().slice("person".length).trim();
        let extraClass = "";
        let title = "";

        if (raw) {
          const parts = raw.split(/\s+/);
          // 第一个词若以 ps- 开头，作为主题类
          if (parts[0]?.startsWith("ps-")) {
            extraClass = parts.shift()!;
          }
          title = parts.join(" ");
        }

        const titleHtml = title
          ? `<div class="ps-header"><div class="ps-title">${md.utils.escapeHtml(title)}</div></div>`
          : `<div class="ps-header"></div>`;

        // 说明：
        // - 头像：直接在块内的第一张图片会被识别为头像（Markdown 图片语法即可）
        // - 其余内容按普通 Markdown 渲染

        return `<div class="custom-block person ${extraClass}">${titleHtml}<div class="ps-body">\n`;
      } else {
        return `</div></div>\n`;
      }
    },
  });
}