<template>
    <div>
      <el-row>
        <el-col :span="20">
          <el-collapse>
            <el-collapse-item
              v-for="(content, index) in xmlContents"
              :key="index"
              :title="content.title"
              :name="index + 1"
              style="font-size: 24px;"
            >
              <pre>{{ content.body }}</pre>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { parseStringPromise } from 'xml2js';
  import '@/view/ef/index.css'
  export default {
    props: {
      fileNames: {
        type: Array,
        required: true
      }
    },
    setup(props) {
        const xmlContents = ref([]);

        const fetchXmlFile = async (fileName) => {
        try {
            const response = await fetch(`/xml/${fileName}.xml`);
            if (!response.ok) throw new Error(`Failed to fetch ${fileName}.xml`);
            const text = await response.text();
            const result = await parseStringPromise(text);
            return {
            title: fileName,
            body: result
            };
        } catch (error) {
            console.error(error);
            return {
            title: fileName,
            body: 'Failed to fetch or parse the XML file.'
            };
        }
        };
        // 替换函数，将标题中的下划线转换为 ">>>"
        function replaceUnderscores(title) {
            return title.replace(/_/g, '>>>');
        };
        onMounted(async () => {
            const contents = await Promise.all(props.fileNames.map(fetchXmlFile));
            console.log(contents)
            xmlContents.value = contents.map(content => ({
                title: replaceUnderscores(content.title),
                body: JSON.stringify(content.body, null, 2)
            }));
        });
    
        return {
            xmlContents
        };
    }
  };
  </script>
  
  <style scoped>
  ::v-deep .el-collapse-item__header {
    font-size: 15px;
  }
  
  ::v-deep .el-collapse-item__content {
    font-size: 15px;
  }
  </style>
  