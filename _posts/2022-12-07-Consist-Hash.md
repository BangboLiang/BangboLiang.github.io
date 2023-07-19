---
layout: post
title: Consist Hash using fnv1_32hash
tags: [Code,Cpp,Hash]
cover-img: /assets/img/background.png
thumbnail-img: /assets/img/avatar-icon.png
share-img: /assets/img/background.png
comments: true
---

# Consist Hash

## A concsit hash sample using Cpp language.

Just check out in any environment that has C++ compiler and run it!

```cpp
#include <iostream>
#include <string>
#include <math.h>
#include <map>
#include <fstream>
#include <random>
#include <ctime>

#define MAX_HASH_NODE_NUM 100
#define DEBUG_MODE 0

using namespace std;

struct serverNode
{
    int type;       //virtual:0     real:1
    string toIP;    //for virt node
    string IP;      //for real node
    int visit_num;  
};


map<int,serverNode> HashNodes;

int getHash(unsigned char *str)
{//fnv1_32_hash
    int p = 16777619;
    int hash = (int) 2166136261L;
    int c;
    while(c = *str++)
    {
        hash = (hash ^ c) * p;
    }
    hash += hash << 13;
    hash ^= hash >> 7;
    hash += hash << 3;
    hash ^= hash >> 17;
    hash += hash << 5;
    if (hash < 0)
        {
            hash = abs(hash);
        }
    return hash;
}

string num_to_string(int num)
{
    int x = num;
    int len = 0;
    string __res;
    while(x!=0)
    {
        len ++;
        x = x / 10;
    }
    x = num;
    for (int i = len; i > 0; --i)
    {
        char c = (x / pow(10,i - 1) + '0');
        __res += c;
        x = x % (int)pow(10,i - 1);
    }
    return __res;
}

void add_server_node(serverNode& node)
{
    int key;
    if(node.type == 1)
    {
        key = getHash((unsigned char*)node.IP.c_str());
        pair<int,serverNode> temp;
        temp.first = key;
        temp.second = node;
        HashNodes.insert(temp);
    }
    else if (node.type == 0)
    {
        //key = getHash((unsigned char*)node.IP.c_str());
        int randnum = rand() % 1000;
        string tempstr = node.toIP + num_to_string(randnum);
        key = getHash( (unsigned char*) tempstr.c_str() );
        pair<int,serverNode> temp;
        temp.first = key;
        temp.second = node;
        HashNodes.insert(temp);
    }
}

void init_server_node(serverNode& node, int servertype)
{
    if (servertype != 0 && servertype != 1)
    {
        printf("Server Type Error!\n");
        exit(1);
    }
    node.type = servertype;
    node.visit_num = 0;
}

void show_all_servers()
{
    map<int,serverNode>::iterator iter;
    for (iter = HashNodes.begin(); iter != HashNodes.end(); iter++)
    {
        // cout << iter->first << " " << iter->second.IP << endl;
        if (iter->second.type == 1)
        {
            cout << "Real: key:" << iter->first << " IP:" << iter->second.IP << endl;
        }
        else
        {
            cout << "Virtual: key:" << iter->first << " toIP:" << iter->second.toIP << endl;
        }
    }
}

void show_all_real_visit()
{
    int sum = 0;
    map<int,serverNode>::iterator iter;
    for (iter = HashNodes.begin(); iter != HashNodes.end(); iter++)
    {
        if (iter->second.type == 1)
        {
            cout << " IP:" << iter->second.IP << " visited time: " << iter->second.visit_num << endl;
            sum += iter->second.visit_num;
        }
    }
    cout << "total visited time: " << sum << endl;
    double sum2 = sum;
    for (iter = HashNodes.begin(); iter != HashNodes.end(); iter++)
    {
        if (iter->second.type == 1)
        {
            cout << " IP:" << iter->second.IP << " visited rate: " << (iter->second.visit_num/sum2) * 100.0 << "%" << endl;
        }
    }
}

int main(int argc, char const *argv[])
{  
    srand(time(0));
    string IP_address_raw = "192.168.0.";
    // add real nodes
    for (int i = 1; i < 11; i++)    // from "192.168.0.1" to "192.168.0.10"
    {
        string realIP = IP_address_raw + num_to_string(i);
        serverNode temp;
        temp.IP = realIP;
        init_server_node(temp, 1);
        add_server_node(temp);
    }
    // add virual nodes each 9 virtual nodes refer to 1 real node
    for (int i = 0; i < 90; i++)
    {
        string virtIP = IP_address_raw + num_to_string(i/9 + 1);
        serverNode temp;
        temp.toIP = virtIP;
        init_server_node(temp,0);
        add_server_node(temp);
    }

    // show_all_servers();

    // generate keys to visit
    for (int i = 0; i < 1000000; i++)
    {
        //random set key
        int key = rand() % 2147483647;
        int key_hash = getHash((unsigned char*) num_to_string(key).c_str());
        map<int,serverNode>::iterator iter;
        iter = HashNodes.lower_bound(key_hash); //Find node to visit
        if(iter != HashNodes.end())
        {
            if (iter->second.type == 1)     // for real node
            {
                iter->second.visit_num++;
            }
            else    // for virtual node, find the real node it goes to.
            {
                map<int,serverNode>::iterator iter2;
                for (iter2 = HashNodes.begin(); iter2!= HashNodes.end(); iter2++)
                {
                    if(iter2->second.type == 1)
                    {
                        if (iter2->second.IP == iter->second.toIP)
                        {
                            iter2->second.visit_num++;
                        }
                    }
                }
            }
        }
        else    //The max key goes to the first node
        {
            iter = HashNodes.begin();
            if (iter->second.type == 1)     // for real node
            {
                iter->second.visit_num++;
            }
            else
            {
                map<int,serverNode>::iterator iter2;
                for (iter2 = HashNodes.begin(); iter2!= HashNodes.end(); iter2++)
                {
                    if(iter2->second.type == 1)
                    {
                        if (iter2->second.IP == iter->second.toIP)
                        {
                            iter2->second.visit_num++;
                        }
                    }
                }
            }
        }
    }
    show_all_real_visit();
    return 0;
}

```
